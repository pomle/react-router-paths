import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Path, PathCodec } from '@pomle/paths';

type Params<Codec extends PathCodec> = Parameters<Path<Codec>['build']>[0];

export function useNav<Codec extends PathCodec>(path: Path<Codec>) {
  const { push } = useHistory();

  return useMemo(() => {
    function to(params: Params<Codec>) {
      return path.build(params);
    }

    function go(params: Params<Codec>) {
      const url = to(params);
      push(url);
    }

    function on(params: Params<Codec>) {
      return () => go(params);
    }

    return { go, on, to };
  }, [push, path]);
}
