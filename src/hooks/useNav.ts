import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Path, PathCodec, Query, QueryCodec } from '@pomle/paths';

type PathParams<Codec extends PathCodec> = Parameters<Path<Codec>['build']>[0];

type QueryParams<Codec extends QueryCodec> = Parameters<
  Query<Codec>['build']
>[0];

export function useNav<P extends PathCodec, Q extends QueryCodec>(
  path: Path<P>,
  query?: Query<Q>,
) {
  const { push } = useHistory();

  return useMemo(() => {
    function to(p: PathParams<P>, q?: QueryParams<Q>) {
      let text = path.build(p);
      if (query && q) {
        text += '?' + query.build(q);
      }

      return text;
    }

    function go(p: PathParams<P>, q?: QueryParams<Q>) {
      const url = to(p, q);
      push(url);
    }

    function on(p: PathParams<P>, q?: QueryParams<Q>) {
      return () => go(p, q);
    }

    return { go, on, to };
  }, [push, path]);
}
