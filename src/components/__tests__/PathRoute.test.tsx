import React from 'react';
import { codecs, createPath } from '@pomle/paths';
import renderer from 'react-test-renderer';
import { createContext } from '../../mocks/context';
import { PathRoute, mount } from '../PathRoute';

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

    expect(spy).toHaveBeenCalledWith({
      exact: true,
      params: { count: 13, with: 'foo' },
    });
  });

  it('calls children with params when path is matching partially', () => {
    const { Component } = createContext(['/my/path/bar/16/and/parts']);
    const spy = jest.fn(mounter);

    renderer.create(
      <Component>
        <PathRoute path={path}>{spy}</PathRoute>
      </Component>,
    );

    expect(spy).toHaveBeenCalledWith({
      exact: false,
      params: { count: 16, with: 'bar' },
    });
  });

  describe('#mount', () => {
    it('mounts a component and renders on exact match', () => {
      const { Component } = createContext(['/my/path/bar/16']);
      const spy = jest.fn();

      function RouteRender(props: { count: number; with: string }) {
        spy(props);
        return <div />;
      }

      renderer.create(
        <Component>
          <PathRoute path={path}>{mount(RouteRender)}</PathRoute>
        </Component>,
      );

      expect(spy).toHaveBeenCalledWith({
        count: 16,
        with: 'bar',
      });
    });

    it('does not mount a component with overmatch', () => {
      const { Component } = createContext(['/my/path/bar/16/with/over/match']);
      const spy = jest.fn();

      function RouteRender(props: { count: number; with: string }) {
        spy(props);
        return <div />;
      }

      renderer.create(
        <Component>
          <PathRoute path={path}>{mount(RouteRender)}</PathRoute>
        </Component>,
      );

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('does not mount a component with undermatch', () => {
      const { Component } = createContext(['/my/path']);
      const spy = jest.fn();

      function RouteRender(props: { count: number; with: string }) {
        spy(props);
        return <div />;
      }

      renderer.create(
        <Component>
          <PathRoute path={path}>{mount(RouteRender)}</PathRoute>
        </Component>,
      );

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
