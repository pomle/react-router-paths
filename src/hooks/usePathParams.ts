import { Path, PathCodec } from '@pomle/paths';
import { useResolvedPath } from 'react-router-dom';
import { assertParams } from '../lib/assert';

export function usePathParams<Codec extends PathCodec>(path: Path<Codec>) {
  const resolved = useResolvedPath(path.path);

  return assertParams(path, resolved.pathname);
}
