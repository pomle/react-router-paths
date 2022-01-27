import { renderHook } from '@testing-library/react-hooks';
import { createContext } from '../../mocks/context';
import { codecs, createPath } from '@pomle/paths';
import { useNav } from '../useNav';
import { act } from 'react-test-renderer';

describe('useNav', () => {
  const path = createPath('/my/path/:word/:number', {
    word: codecs.string,
    number: codecs.number,
  });

  it('returns go function that navigates with push', () => {
    const { Component, history } = createContext();

    const hook = renderHook(() => useNav(path), {
      wrapper: Component,
    });

    expect(history.length).toBe(1);

    const nav = hook.result.current;

    act(() => {
      nav.go({ word: 'foo', number: 3 });
      hook.rerender();
    });

    expect(history.length).toBe(2);
    expect(history.entries[1].pathname).toEqual('/my/path/foo/3');
  });

  it('returns on function that returns a callback that navigates with push', () => {
    const { Component, history } = createContext();

    const hook = renderHook(() => useNav(path), {
      wrapper: Component,
    });

    expect(history.length).toBe(1);

    const nav = hook.result.current;

    act(() => {
      const handleSomething = nav.on({ word: 'foo', number: 3 });
      expect(history.length).toBe(1);

      handleSomething();
      expect(history.length).toBe(2);
      hook.rerender();
    });

    expect(history.length).toBe(2);
    expect(history.entries[1].pathname).toEqual('/my/path/foo/3');
  });

  it('returns to function that returns a string', () => {
    const { Component, history } = createContext();

    const hook = renderHook(() => useNav(path), {
      wrapper: Component,
    });

    expect(history.length).toBe(1);

    const nav = hook.result.current;

    const url = nav.to({ word: 'foo', number: 3 });
    expect(url).toEqual('/my/path/foo/3');
  });
});
