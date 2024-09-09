import { parseQuery, Query, QueryCodec } from '@pomle/paths';

type ParamCache = { source: string; value: unknown };

export function createParser<T extends QueryCodec>(query: Query<T>) {
  const memo = new Map<string, ParamCache[]>();

  function getCache(key: string) {
    let result = memo.get(key);
    if (!result) {
      result = [];
      memo.set(key, result);
    }
    return result;
  }

  return function stableParse(search: string) {
    const parsed = parseQuery(search);
    const decoded = query.parse(search);
    for (const key of Object.keys(decoded)) {
      const cache = getCache(key);
      const sources = parsed[key];
      const output = decoded[key] as unknown[];
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
