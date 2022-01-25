# Bridge between React Router and [Paths](https://github.com/pomle/paths)

# Install

This library depends on `react` >= 16.8 (hooks support) and `@pomle/paths`.


# Usage

### useQueryParams

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
      <li>Numbers: {params.numbers.join(", ")}</li>
      <li>Words: {params.words.join(", ")}</li>
    </div>
  );
}
```

#### Defining query with `createQuery`

Using `createQuery` to define queries allows you to share query information between components. This is useful both when you want to build URLs with query params, and when you want to use the same params in multiple components without prop drilling.
