import { useCallback, useMemo } from 'react';
import { buildQuery, parseQuery, Query, QueryCodec } from '@pomle/paths';
import { useHistory, useLocation } from '../context/RouterContext';

type Values<T extends QueryCodec> = ReturnType<Query<T>['parse']>;

export function useQueryParams<T extends QueryCodec>(
  query: Query<T>,
): [Values<T>, (values: Partial<Values<T>>) => void] {
  const location = useLocation();
  const history = useHistory();
  const search = location.search;

  const params = useMemo(() => {
    return query.parse(search);
  }, [search, query]);

  const updateQuery = useCallback(
    (source: Values<T>) => {
      const data = { ...parseQuery(search), ...query.encode(source) };
      const url = new URL(location.href);
      url.search = buildQuery(data);
      history.replace(url);
    },
    [history, search, query, location],
  );

  const setParams = useCallback(
    (values: Partial<Values<T>>) => {
      const data = { ...params, ...values };
      updateQuery(data);
    },
    [params, updateQuery],
  );

  return [params, setParams];
}
