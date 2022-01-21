import React from 'react';
import { Route } from 'react-router-dom';
import { Path, PathCodec } from '@pomle/paths';
import { assertParams } from '../lib/assert';

interface PathRouteProps<Codec extends PathCodec> {
  path: Path<Codec>;
  children: (params: ReturnType<Path<Codec>['decode']>) => React.ReactElement;
}

export default function PathRoute<T extends PathCodec>({
  path,
  children,
}: PathRouteProps<T>) {
  return (
    <Route path={path.path}>
      {({ match }: { match: any }) => {
        if (match === null) {
          return null;
        }

        if (!match.isExact) {
          return null;
        }

        const params = assertParams(path, match?.params);
        return children(params);
      }}
    </Route>
  );
}
