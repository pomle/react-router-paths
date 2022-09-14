import React from 'react';
import { Route, RouteChildrenProps } from 'react-router-dom';
import { Path, PathCodec } from '@pomle/paths';
import { assertParams } from '../lib/assert';

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
  return (
    <Route path={path.path}>
      {({ match }: RouteChildrenProps) => {
        if (match) {
          const params = assertParams(path, match.params);
          return children({ params, exact: match.isExact });
        }

        return children(null);
      }}
    </Route>
  );
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
