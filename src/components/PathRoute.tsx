import React from 'react';
import { Route, RouteChildrenProps } from 'react-router-dom';
import { Path, PathCodec } from '@pomle/paths';
import { assertParams } from '../lib/assert';

type Values<Codec extends PathCodec> = ReturnType<Path<Codec>['decode']>;

interface PathRouteProps<Codec extends PathCodec> {
  path: Path<Codec>;
  children: (params: Values<Codec> | null) => React.ReactElement | null;
}

export function PathRoute<T extends PathCodec>({
  path,
  children,
}: PathRouteProps<T>) {
  return (
    <Route path={path.path}>
      {({ match }: RouteChildrenProps) => {
        const params = match ? assertParams(path, match.params) : null;
        return children(params);
      }}
    </Route>
  );
}
