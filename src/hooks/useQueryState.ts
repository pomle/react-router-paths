import { useMemo, useState } from 'react';
import { Query, QueryCodec } from '@pomle/paths';
import { debounce } from '@pomle/throb';
import { useQueryParams } from './useQueryParams';

/*
Hook that stores a local state mirroring state from params,
and updates params asynchronosly.

Prevents excessive hammering of replace history, which is not
allowed in browsers, while still being able to save state in
URL effectively and transparently.
*/
type QueryValues<Codec extends QueryCodec> = {
  [key in keyof Codec]: ReturnType<Codec[key]['decode']>[];
};

export function useQueryState<Codec extends QueryCodec>(query: Query<Codec>) {
  type Values = QueryValues<Codec>;

  const [params, setParams] = useQueryParams(query);

  const [state, setState] = useState(params);

  const handleState = useMemo(() => {
    const updateParam = debounce((values: Partial<Values>) => {
      setParams(values);
    }, 250);

    return (values: Partial<Values>) => {
      setState((state) => ({ ...state, ...values }));
      updateParam(values);
    };
  }, [setParams]);

  return [state, handleState] as [Values, (value: Partial<Values>) => void];
}
