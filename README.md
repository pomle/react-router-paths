# Bridge between React Router and [Paths](https://github.com/pomle/paths)

# Install

This library depends on `react @ >=16.8` (hooks support) and `@pomle/paths @ >=1.3`.


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

| Query before          	| `setParams` call                    	| Query after               	|
|-----------------------	|-------------------------------------	|---------------------------	|
| `?words=foo`          	| `setParams({words: ["bar"]})`        	| `?words=bar`              	|
| `?words=foo`          	| `setParams({numbers: [1337]})`       	| `?words=foo&numbers=1337` 	|
| `?words=foo&number=2` 	| `setParams({numbers: []})`           	| `?words=foo`              	|
| `?words=foo&number=2` 	| `setParams({words: [], numbers: []})`	| `?`                       	|

You can also consider reading the [test suite](https://github.com/pomle/react-router-paths/blob/main/src/hooks/__tests__/useQueryParams.test.tsx).


#### Defining query with `createQuery`

Using `createQuery` to define queries allows you to share query information between components. This is useful both when you want to build URLs with query params, and when you want to use the same params in multiple components without prop drilling.
