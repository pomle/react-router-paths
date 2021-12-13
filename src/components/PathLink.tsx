import React from 'react';
import { Link } from 'react-router-dom';
import { Path, PathCodec } from '@pomle/paths';

interface PathLinkProps<Codec extends PathCodec> {
  path: Path<Codec>;
  params: Parameters<Path<Codec>['url']>[0];
  children: React.ReactNode;
}

export default function PathLink<T extends PathCodec>({
  path,
  params,
  children,
}: PathLinkProps<T>) {
  const url = path.build(params);

  return <Link to={url}>{children}</Link>;
}
