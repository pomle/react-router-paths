import { Path } from '@pomle/paths';
import { AssertionError } from 'assert';

export function assertParams<P extends Path<any>>(
  path: P,
  params: unknown,
): Parameters<P['decode']>[0] {
  try {
    return path.decode(params as any);
  } catch (e) {
    throw new AssertionError({
      message: `${path.path} can not decode params`,
      actual: params,
    });
  }
}
