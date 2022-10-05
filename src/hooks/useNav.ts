import { useMemo } from 'react';
import { Path, PathCodec, Query, QueryCodec } from '@pomle/paths';
import { useHistory } from '../context/RouterContext';

type PathParams<Codec extends PathCodec> = Parameters<Path<Codec>['build']>[0];

type QueryParams<Codec extends QueryCodec> = Parameters<
  Query<Codec>['build']
>[0];

export function useNav<P extends PathCodec>(
  path: Path<P>,
): {
  to(p: PathParams<P>): string;
  go(p: PathParams<P>): void;
  set(p: PathParams<P>): void;
  on(p: PathParams<P>): () => void;
};

export function useNav<P extends PathCodec, Q extends QueryCodec>(
  path: Path<P>,
  query: Query<Q>,
): {
  to(p: PathParams<P>, q?: QueryParams<Q>): string;
  go(p: PathParams<P>, q?: QueryParams<Q>): void;
  set(p: PathParams<P>, q?: QueryParams<Q>): void;
  on(p: PathParams<P>, q?: QueryParams<Q>): () => void;
};
export function useNav<P extends PathCodec, Q extends QueryCodec>(
  path: Path<P>,
  query?: Query<Q>,
) {
  const { push, replace } = useHistory();

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

    function set(p: PathParams<P>, q?: QueryParams<Q>) {
      const url = to(p, q);
      replace(url);
    }

    function on(p: PathParams<P>, q?: QueryParams<Q>) {
      return () => go(p, q);
    }

    return { go, set, on, to };
  }, [push, replace, path, query]);
}
