# Bridge between React Router and [Paths](https://github.com/pomle/paths)

# Install

This library depends on `react` >= 16.8 (hooks support) and `@pomle/paths`.


# Usage

### useQueryParams

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
