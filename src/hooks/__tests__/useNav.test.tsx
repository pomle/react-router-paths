import { renderHook } from '@testing-library/react-hooks';
import { createContext } from '../../mocks/context';
import { codecs, createPath, createQuery } from '@pomle/paths';
import { useNav } from '../useNav';
import { act } from 'react-test-renderer';

describe('useNav', () => {
  const path = createPath('/my/path/:word/:number', {
    word: codecs.string,
    number: codecs.number,
  });

  const query = createQuery({
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

  it('returns go function that navigates with push and supports query string', () => {
    const { Component, history } = createContext();

    const hook = renderHook(() => useNav(path, query), {
      wrapper: Component,
    });

    expect(history.length).toBe(1);

    const nav = hook.result.current;

    act(() => {
      nav.go({ word: 'foo', number: 3 }, { word: ['a'], number: [1, 2, 3] });
      hook.rerender();
    });

    expect(history.length).toBe(2);
    expect(history.entries[1].search).toEqual(
      '?word=a&number=1&number=2&number=3',
    );
  });

  it('returns set function that navigates with replace', () => {
    const { Component, history } = createContext(['/my/path/bar/4']);

    const hook = renderHook(() => useNav(path), {
      wrapper: Component,
    });

    expect(history.length).toBe(1);

    const nav = hook.result.current;

    act(() => {
      nav.set({ word: 'foo', number: 3 });
      hook.rerender();
    });

    expect(history.length).toBe(1);
    expect(history.entries[0].pathname).toEqual('/my/path/foo/3');
  });

  it('returns set function that navigates with replace and supports query string', () => {
    const { Component, history } = createContext(['/my/path/bar/4']);

    const hook = renderHook(() => useNav(path, query), {
      wrapper: Component,
    });

    expect(history.length).toBe(1);

    const nav = hook.result.current;

    act(() => {
      nav.set({ word: 'foo', number: 3 }, { word: ['a', 'b'] });
      hook.rerender();
    });

    expect(history.length).toBe(1);
    expect(history.entries[0].search).toEqual('?word=a&word=b');
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
    const { Component } = createContext();

    const hook = renderHook(() => useNav(path), {
      wrapper: Component,
    });

    const nav = hook.result.current;
    const url = nav.to({ word: 'foo', number: 3 });
    expect(url).toEqual('/my/path/foo/3');
  });

  it('supports path with query', () => {
    const { Component } = createContext();

    const hook = renderHook(() => useNav(path, query), {
      wrapper: Component,
    });

    const nav = hook.result.current;
    const url = nav.to(
      { word: 'foo', number: 3 },
      { word: ['bar'], number: [16, 31] },
    );
    expect(url).toEqual('/my/path/foo/3?word=bar&number=16&number=31');
  });

  it('partial query is allowed', () => {
    const { Component } = createContext();

    const hook = renderHook(() => useNav(path, query), {
      wrapper: Component,
    });

    const nav = hook.result.current;
    const url = nav.to({ word: 'foo', number: 3 }, { word: ['bar'] });
    expect(url).toEqual('/my/path/foo/3?word=bar');
  });

  it('treats query as optional', () => {
    const { Component } = createContext();

    const hook = renderHook(() => useNav(path, query), {
      wrapper: Component,
    });

    const nav = hook.result.current;
    const url = nav.to({ word: 'foo', number: 3 });
    expect(url).toEqual('/my/path/foo/3');
  });

  it('uses empty query values', () => {
    const { Component } = createContext();

    const hook = renderHook(() => useNav(path, query), {
      wrapper: Component,
    });

    const nav = hook.result.current;
    const url = nav.to({ word: 'foo', number: 3 }, {});
    expect(url).toEqual('/my/path/foo/3?');
  });
});
