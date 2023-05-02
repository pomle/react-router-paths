import { useCallback, useMemo } from 'react';
import { buildQuery, parseQuery, Query, QueryCodec } from '@pomle/paths';
import { useRouter } from '../context/RouterContext';

type Values<T extends QueryCodec> = ReturnType<Query<T>['parse']>;

export function useQueryParams<T extends QueryCodec>(
  query: Query<T>,
): [Values<T>, (values: Partial<Values<T>>) => void] {
  const { location, history, window } = useRouter();
  const search = location.search;

  const params = useMemo(() => {
    return query.parse(search);
  }, [search, query]);

  const setParams = useCallback(
    (source: Partial<Values<T>>) => {
      const search = window.location.search;

      // Raw data - may be owned by third party
      const raw = parseQuery(search);

      // Params owned by us
      const ours = query.parse(search);

      // Params being constructed
      const next = query.encode({ ...ours, ...source });

      const url = new URL(location.href);
      url.search = buildQuery({ ...raw, ...next });
      history.replace(url);
    },
    [history, query],
  );

  return [params, setParams];
}
