import React, { useEffect } from 'react';
import { createContext } from '../../mocks/context';
import { createPath } from '@pomle/paths';
import { useNav } from '../../hooks/useNav';
import { create, act } from 'react-test-renderer';
import { useLocation } from '../RouterContext';

describe('RouterContext', () => {
  const path = createPath('/my/path', {});

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
});
