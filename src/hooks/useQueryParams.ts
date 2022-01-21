import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router';
import { buildQuery, parseQuery, Query, QueryCodec } from '@pomle/paths';

type Values<T extends QueryCodec> = ReturnType<Query<T>['parse']>;

export function useQueryParams<T extends QueryCodec>(
  query: Query<T>,
): [Values<T>, (values: Partial<Values<T>>) => void] {
  const history = useHistory();
  const search = history.location.search;

  const params = useMemo(() => {
    return query.parse(search);
  }, [search, query]);

  const updateQuery = useCallback(
    (source: Values<T>) => {
      const data = { ...parseQuery(search), ...query.encode(source) };

      history.replace({
        ...history.location,
        search: buildQuery(data),
      });
    },
    [history, search, query],
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
