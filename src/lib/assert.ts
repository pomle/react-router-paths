import { Path } from '@pomle/paths';

export function assertParams<P extends Path<any>>(
  path: P,
  params: Record<string, string>,
) {
  try {
    return path.decode(params);
  } catch (e) {
    console.warn('Bad params for path %s', path.path, params);
    throw new Error(`Could not decode params`);
  }
}
