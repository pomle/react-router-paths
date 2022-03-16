import React from 'react';
import { Route, RouteChildrenProps } from 'react-router-dom';
import { Path, PathCodec } from '@pomle/paths';
import { assertParams } from '../lib/assert';

type Values<Codec extends PathCodec> = ReturnType<Path<Codec>['decode']>;

type Match<Codec extends PathCodec> = {
  params: Values<Codec>;
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
          return children({ params });
        }

        return children(null);
      }}
    </Route>
  );
}
