import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Query, QueryCodec } from '@pomle/paths';

type Values<T extends QueryCodec> = ReturnType<Query<T>['parse']>;

export function useQueryParams<T extends QueryCodec>(
  query: Query<T>,
): [Values<T>, (values: Values<T>) => void] {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search;

  const getParams = useCallback(() => {
    return query.parse(search);
  }, [search, query]);

  const setParams = useCallback(
    (source: Values<T>) => {
      const search = query.build(source);
      navigate(
        {
          ...location,
          search,
        },
        {
          replace: true,
        },
      );
    },
    [history, query],
  );

  const state = useMemo(() => {
    return getParams();
  }, [getParams]);

  const setState = useCallback(
    (values: Values<T>) => {
      const data = { ...getParams(), ...values };
      setParams(data);
    },
    [getParams, setParams],
  );

  return [state, setState];
}
