import { Path, PathCodec } from '@pomle/paths';
import { useParams } from 'react-router-dom';
import { assertParams } from '../lib/assert';

export function usePathParams<Codec extends PathCodec>(path: Path<Codec>) {
  const params = useParams();

  return assertParams(path, params);
}
