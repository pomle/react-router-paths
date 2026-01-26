import { useCallback, useEffect, useState } from 'react';
import { Path, PathCodec } from '@pomle/paths';
import { useWindow } from '../context/RouterProvider';

type Values<Codec extends PathCodec> = ReturnType<Path<Codec>['decode']>;

type Match<Codec extends PathCodec> = {
  params: Values<Codec>;
  exact: boolean;
};

export function usePathMatch<T extends PathCodec>(path: Path<T>) {
  const window = useWindow();

  const stableParse = useCallback(
    (pathname: string) => {
      const params = path.parse(pathname);

      if (params === null) {
        return null;
      }

      const diff = path.match(pathname);
      return {
        exact: diff === 0,
        params,
      };
    },
    [path],
  );

  const [match, setMatch] = useState<Match<T> | null>(() => {
    return stableParse(window.location.pathname);
  });

  useEffect(() => {
    function handleParams() {
      const match = stableParse(window.location.pathname);
      setMatch(match);
    }

    window.addEventListener('popstate', handleParams);

    return () => {
      window.removeEventListener('popstate', handleParams);
    };
  }, [window, stableParse]);

  return match;
}
