// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import React, { useEffect } from 'react';
import { createContext } from '../../mocks/context';
import { createPath } from '@pomle/paths';
import { useNav } from '../../hooks/useNav';
import { fireEvent, render, renderHook } from '@testing-library/react';
import { useHistory, useLocation } from '../RouterProvider';

describe('RouterProvider', () => {
  const path = createPath('/my/path', {});

  it('provides a reference stable history object', () => {
    const { Component } = createContext();

    const hook = renderHook(() => useHistory(), {
      wrapper: Component,
    });

    const ref = hook.result.current;

    hook.rerender();

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

    const { container } = render(
      <Component>
        <Redirect />
      </Component>,
    );

    expect(history.length).toBe(2);
    expect(history.entries[1].pathname).toBe('/my/path');
    expect(container.textContent).toEqual('/my/path');
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

    const { container } = render(
      <Component>
        <Content />
      </Component>,
    );

    const forw = container.querySelector('[data-what=forw]')!;
    const back = container.querySelector('[data-what=back]')!;
    const jump = container.querySelector('[data-what=jump]')!;

    const urlText = container.querySelector('[data-what=loc]');

    expect(history.length).toBe(6);
    expect(urlText?.textContent).toEqual('/a/1');

    fireEvent.click(forw);
    expect(urlText?.textContent).toEqual('/b/2');

    fireEvent.click(back);
    expect(urlText?.textContent).toEqual('/a/1');

    fireEvent.click(jump);
    expect(urlText?.textContent).toEqual('/d/4');
  });
});
