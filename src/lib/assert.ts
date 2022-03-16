import { Path, PathCodec } from '@pomle/paths';

export function assertParams<Codec extends PathCodec>(
  path: Path<Codec>,
  params: any,
) {
  return path.decode(params);
}
