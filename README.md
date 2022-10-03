# Bridge between React Router and [Paths](https://github.com/pomle/paths)

# Install

This library depends on `react @ >=16.8` (hooks support), `@pomle/paths @ ^1.3`, and `react-router`.

```bash
yarn add @pomle/react-router-paths @pomle/paths@^1.3 react-router@^5.3.3 react-router-dom@^5.3.3
```

# Usage

This package is similar to React Router, albeit stricter. A decision has been made that path params are considered always required for a path. If you require optional parameters, these must be implemented with query params (see [`useQueryParams` hook](#usequeryparams)).

## PathRoute

`PathRoute` always takes a render function that is called with a match object. If the match object exists, the URL matched, and the parsed params is available. If it did not match, the match object is null.

### Match

An object **maybe** passed into render function given to `PathRoute` containing the matched params, and a flag indicating if the path matched exactly, or partly. Partly matching means the actual path was longer than the matching part, and implies there may be better matches. The `Match` object will only be passed if there was a match, otherwise `null` is given.

```tsx
type Match = {
  params: {};
  exact: boolean;
};
```

When creating transitions between views we need to keep the elements mounted despite there not being a match. Therefore the render function is called regardless if there was a match or not. Transitioning is left to the implementer to decide.

You **must** return `null` from the render function if you do not want that path to render something. Use the [`mount` function](#mount) when uncertain.

```tsx
import { createPath, codecs } from '@pomle/paths';
import { PathRoute } from '@pomle/react-router-paths';
import { BrowserRouter } from 'react-router-dom';

const paths = {
  books: createPath('/books/:bookId', { bookId: codecs.string }),
};

export function MyRouter() {
  return (
    <BrowserRouter>
      <PathRoute path={paths.books}>
        {(match) => {
          if (!match) {
            // URL did not match, render nothing.
            return null;
          }

          // URL did match, params are available.
          const { bookId } = match.params;

          // Render page.
          return <BookPage bookId={bookId} />;
        }}
      </PathRoute>
    </BrowserRouter>
  );
}
```

## mount

The mount function is a utility that will provide the logic from the previous example. It requires the params of the path to match the props of the mounted component.

```tsx
import { createPath } from '@pomle/paths';
import { PathRoute, mount } from '@pomle/react-router-paths';
import { BrowserRouter } from 'react-router-dom';

const paths = {
  books: createPath('/books/:bookId', { bookId: codecs.string }),
};

export function MyRouter() {
  return (
    <BrowserRouter>
      <PathRoute path={paths.books}>{mount(BookPage)}</PathRoute>
    </BrowserRouter>
  );
}
```

## useQueryParams

The hook `useQueryParams` uses a `Query` object from [`@pomle/paths`](https://github.com/pomle/paths) and is similar to `useState` in that it returns a tuple of existing state, and a function to update state in query params.

```tsx
import { codecs, createQuery } from '@pomle/paths';
import { useQueryParams } from '@pomle/react-router-paths';

const query = createQuery({
  words: codecs.string,
  numbers: codecs.number,
});

export default function Component() {
  const [params, setParams] = useQueryParams(query);

  return (
    <div>
      <li>Numbers: {params.numbers.join(', ')}</li>
      <li>Words: {params.words.join(', ')}</li>
    </div>
  );
}
```

### `params` object

The `params` object contains an array of decoded query param values for each key and codec given to `createQuery`.

Given the below query;

```ts
const query = createQuery({
  words: codecs.string,
  numbers: codecs.number,
});
```

and the URL being `?words=foo&words=bar&numbers=3`, the below `useQueryParams` hook;

```ts
const [params, setParams] = useQueryParams(query);
```

the `params` variable will contain;

```ts
{
  words: ["foo", "bar"],
  numbers: [3],
}
```

Array will always be populated for every defined key and contain zero or more elements.

### `setParams` function

The `setParams` function will take an object of the same shape of `params` where keys are optional. If key is defined, and array empty, the query params for that key will be removed. If key is not defined, the query params for that key will be untouched.

Examples in the table below may help.

| Query before          | `setParams` call                      | Query after               |
| --------------------- | ------------------------------------- | ------------------------- |
| `?words=foo`          | `setParams({words: ["bar"]})`         | `?words=bar`              |
| `?words=foo`          | `setParams({numbers: [1337]})`        | `?words=foo&numbers=1337` |
| `?words=foo&number=2` | `setParams({numbers: []})`            | `?words=foo`              |
| `?words=foo&number=2` | `setParams({words: [], numbers: []})` | `?`                       |

You can also consider reading the [test suite](https://github.com/pomle/react-router-paths/blob/main/src/hooks/__tests__/useQueryParams.test.tsx).

#### Single param hook `?query=u2`

The `useQueryParams` hook returns the low level API for operating on query string. Real use cases are more likely to implement something similar to `useState` in query string. The following example shows how to create typical implementation that stores the query for a search field.

```tsx
import { codecs, createQuery } from '@pomle/paths';

export const search = createQuery({
  query: codecs.string,
});

function useQuery(): [string, (text: string) => void] {
  const [params, setParams] = useQueryParams(search);

  const query = params.query[0] ?? '';

  const setQuery = useCallback(
    (query: string) => {
      setParams({
        // Resets to /path instead of /path?query= when empty
        query: query.length > 0 ? [query] : [],
      });
    },
    [setParams],
  );

  return [query, setQuery];
}

export default function MySearch() {
  const [query, setQuery] = useQuery();

  return (
    <form>
      <input
        type='text'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </form>
  );
}
```

## useQueryState

Using `useQueryState` you get the same behavior as useQueryParams, but state is stored syncronously using React's `useState`, and query search string is updated asynchronously.

This avoids hammering browser history at the cost of delaying state updates that share the same query.

```tsx
import { codecs, createQuery } from '@pomle/paths';
import { useQueryState } from '@pomle/react-router-paths';

const query = createQuery({
  x: codecs.number,
  y: codecs.number,
});

export default function Component() {
  const [state, setState] = useQueryState(query);

  const pan = {
    x: state.x[0] ?? 0,
    y: state.y[0] ?? 0,
  };

  const handlePointer = useCallback(
    (event: React.PointerEvent) => {
      if (event.buttons === 1) {
        setState({
          x: [event.clientX],
          y: [event.clientY],
        });
      }
    },
    [setState],
  );

  return (
    <div onPointerDown={handlePointer} onPointerMove={handlePointer}>
      <li>Pointer Position: {[pan.x, pan.y].join(',')}</li>
    </div>
  );
}
```

## useNav

With `useNav` you can create navigation objects that are suitable for `<Link>` elements, programatically push history, and create navigation callbacks, with type safety.

The useNav call will return an object with three functions. All of them take the path params as arguments.

- `go` calls history.push.
- `to` creates a location object compatible.
- `on` returns a function that calls history.push when called.

```tsx
import { codecs, createPath } from '@pomle/paths';
import { useNav } from '@pomle/react-router-paths';

const paths = {
  books: createPath('/books/:bookId', { bookId: codecs.string }),
};

export default function Component() {
  const nav = {
    books: useNav(paths.books),
  };

  const handleNav = useCallback(() => {
    nav.books.go({ bookId: 'foo' });
  }, [catBookId]);

  return (
    <ul onMouseWheel={handleNav}>
      <li>
        <button onClick={nav.books.on({ bookId: 'bar' })}>
          Navigate to Bar Book
        </button>
      </li>

      {['a', 'b', 'c', 'd'].map((bookId) => {
        return (
          <li>
            <Link to={nav.books.to({ bookId })}>Foo Book</Link>
          </li>
        );
      })}
    </ul>
  );
}
```

#### Defining query with `createQuery`

Using `createQuery` to define queries allows you to share query information between components. This is useful both when you want to build URLs with query params, and when you want to use the same params in multiple components without prop drilling.
