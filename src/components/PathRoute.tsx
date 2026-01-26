import React, { useCallback, useEffect, useState } from 'react';
import { Path, PathCodec } from '@pomle/paths';
import { useWindow } from '../context/RouterProvider';

type Values<Codec extends PathCodec> = ReturnType<Path<Codec>['decode']>;

type Match<Codec extends PathCodec> = {
  params: Values<Codec>;
  exact: boolean;
};

interface PathRouteProps<Codec extends PathCodec> {
  path: Path<Codec>;
  children: (match: Match<Codec> | null) => React.ReactElement | null;
}

export function PathRoute<T extends PathCodec>({
  path,
  children,
}: PathRouteProps<T>) {
  const window = useWindow();

  const stableParse = useCallback(
    (pathname: string) => {
      const params = path.parse(pathname);

      if (params === null) {
        return null;
      }

      const diff = path.match(window.location.pathname);
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

  return children(match);
}

export function mount<T extends {}>(
  Component: (props: T) => React.ReactElement,
) {
  return function render(match: { params: T; exact: boolean } | null) {
    if (!match || !match.exact) {
      return null;
    }

    return React.createElement(Component, match.params);
  };
}
