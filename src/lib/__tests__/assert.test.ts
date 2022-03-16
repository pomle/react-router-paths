import { codecs, createPath } from '@pomle/paths';
import { assertParams } from '../assert';

describe('assertParams', () => {
  const path = createPath('/foo/:foo/bar/:bar', {
    foo: codecs.string,
    bar: codecs.number,
  });

  it('returns decoded values based on string params', () => {
    expect(assertParams(path, { foo: 'my-param', bar: '-232.23' })).toEqual({
      bar: -232.23,
      foo: 'my-param',
    });
  });

  it('fills in blanks', () => {
    expect(assertParams(path, { something_else: '2' })).toEqual({
      bar: NaN,
      foo: 'undefined',
    });
  });
});
