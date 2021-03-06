import React from 'react';
import { codecs, createPath } from '@pomle/paths';
import renderer from 'react-test-renderer';
import { createContext } from '../../mocks/context';
import { PathRoute } from '../PathRoute';

describe('PathRoute', () => {
  const path = createPath('/my/path/:with/:count', {
    with: codecs.string,
    count: codecs.number,
  });

  type Match = {
    params: ReturnType<typeof path['parse']>;
  };

  function mounter(match: Match | null) {
    if (!match) {
      return null;
    }

    return <>Mounted {match.params.count}</>;
  }

  it('calls children with null when path is not matching', () => {
    const { Component } = createContext();
    const spy = jest.fn(mounter);

    renderer.create(
      <Component>
        <PathRoute path={path}>{spy}</PathRoute>
      </Component>,
    );

    expect(spy).toHaveBeenCalledWith(null);
  });

  it('calls children with params when path is matching', () => {
    const { Component } = createContext(['/my/path/foo/13']);
    const spy = jest.fn(mounter);

    renderer.create(
      <Component>
        <PathRoute path={path}>{spy}</PathRoute>
      </Component>,
    );

    expect(spy).toHaveBeenCalledWith({ params: { count: 13, with: 'foo' } });
  });

  it('calls children with params when path is matching partially', () => {
    const { Component } = createContext(['/my/path/bar/16/and/parts']);
    const spy = jest.fn(mounter);

    renderer.create(
      <Component>
        <PathRoute path={path}>{spy}</PathRoute>
      </Component>,
    );

    expect(spy).toHaveBeenCalledWith({ params: { count: 16, with: 'bar' } });
  });
});
