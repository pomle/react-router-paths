import { useCallback } from 'react';
import { Path, PathCodec, Query, QueryCodec } from '@pomle/paths';
import { useHistory } from '../context/RouterContext';

type PathParams<Codec extends PathCodec> = Parameters<Path<Codec>['build']>[0];

type QueryParams<Codec extends QueryCodec> = Parameters<
  Query<Codec>['build']
>[0];

export function useNavigate<P extends PathCodec, Q extends QueryCodec>() {
  const { push, replace } = useHistory();

  return useCallback(
    (path: Path<P>, query?: Query<Q>) => {
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

      function set(p: PathParams<P>, q?: QueryParams<Q>) {
        const url = to(p, q);
        replace(url);
      }

      function on(p: PathParams<P>, q?: QueryParams<Q>) {
        return () => go(p, q);
      }

      return { go, set, on, to };
    },
    [push, replace],
  );
}
