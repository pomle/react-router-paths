import { parseQuery, Query, QueryCodec } from '@pomle/paths';

type ParamCache = { source: string; value: unknown };

export function createParser<T extends QueryCodec>(query: Query<T>) {
  const memo = new Map<string, ParamCache[]>();

  function getCache(key: string) {
    if (!memo.has(key)) {
      memo.set(key, []);
    }
    return memo.get(key) as ParamCache[];
  }

  return function stableParse(search: string) {
    const parsed = parseQuery(search);
    const decoded = query.parse(search);
    for (const [key, output] of Object.entries(decoded)) {
      const cache = getCache(key);
      const sources = parsed[key];
      if (sources) {
        output.forEach((value: unknown, index: number) => {
          const source = sources[index];
          if (source != null) {
            const prev = cache[index];
            if (prev && prev.source === source) {
              output[index] = prev.value;
            } else {
              cache[index] = { value, source };
            }
          }
        });
      }
      cache.splice(output.length);
    }
    return decoded;
  };
}
