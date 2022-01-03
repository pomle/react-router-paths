import { Path } from '@pomle/paths';

export function assertParams<P extends Path<any>>(
  path: P,
  pathName: string,
): Parameters<P['decode']>[0] {
  try {
    return path.parse(pathName);
  } catch (e) {
    throw new Error(`Path ${path.path} could not parse ${pathName}`);
  }
}
