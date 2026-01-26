import React from 'react';
import { Path, PathCodec } from '@pomle/paths';
import { usePathMatch } from '../hooks/usePathMatch';

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
  const match = usePathMatch(path);

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
