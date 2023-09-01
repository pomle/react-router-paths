import React, { useEffect } from 'react';
import { createContext } from '../../mocks/context';
import { createPath } from '@pomle/paths';
import { useNav } from '../../hooks/useNav';
import { create, act } from 'react-test-renderer';
import { useHistory, useLocation } from '../RouterContext';
import { renderHook } from '@testing-library/react-hooks';

describe('RouterContext', () => {
  const path = createPath('/my/path', {});

  it('provides a reference stable history object', () => {
    const { Component } = createContext();

    const hook = renderHook(() => useHistory(), {
      wrapper: Component,
    });

    const ref = hook.result.current;

    act(() => {
      hook.rerender();
    });

    expect(ref).toBe(hook.result.current);
  });

  it('updates location when doing immediate go on mount', () => {
    const { Component, history } = createContext();

    function Redirect() {
      const nav = useNav(path);

      useEffect(() => {
        nav.go({});
      }, [nav]);

      const location = useLocation();

      return <>{location.pathname}</>;
    }

    let tree: any;

    act(() => {
      tree = create(
        <Component>
          <Redirect />
        </Component>,
      );
    });

    expect(history.length).toBe(2);
    expect(history.entries[1].pathname).toBe('/my/path');
    expect(tree.toJSON()).toEqual('/my/path');
  });

  it('supports go, back, and next calls', async () => {
    const { Component, history } = createContext([
      '/a/1',
      '/b/2',
      '/c/3',
      '/d/4',
      '/e/5',
      '/f/6',
    ]);

    function Content() {
      const { go, back, forward } = useHistory();

      const { pathname } = useLocation();

      return (
        <>
          <div data-what='loc'>{pathname}</div>
          <button data-what='back' onClick={back}>
            Back
          </button>
          <button data-what='forw' onClick={forward}>
            Forward
          </button>

          <button data-what='jump' onClick={() => go(3)}>
            Jump
          </button>
        </>
      );
    }

    const tree = create(
      <Component>
        <Content />
      </Component>,
    );

    expect(history.length).toBe(6);

    act(() => {
      tree.root.findByProps({ 'data-what': 'forw' }).props.onClick();
    });

    expect(tree.root.findByProps({ 'data-what': 'loc' }).children).toEqual([
      '/b/2',
    ]);

    act(() => {
      tree.root.findByProps({ 'data-what': 'back' }).props.onClick();
    });

    expect(tree.root.findByProps({ 'data-what': 'loc' }).children).toEqual([
      '/a/1',
    ]);

    act(() => {
      tree.root.findByProps({ 'data-what': 'jump' }).props.onClick();
    });

    expect(tree.root.findByProps({ 'data-what': 'loc' }).children).toEqual([
      '/d/4',
    ]);
  });
});
