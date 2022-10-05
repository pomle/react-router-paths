import { renderHook } from '@testing-library/react-hooks';
import { createContext } from '../../mocks/context';
import { codecs, createQuery } from '@pomle/paths';
import { useQueryState } from '../useQueryState';
import { act } from 'react-test-renderer';

describe('useQueryState', () => {
  const query = createQuery({
    word: codecs.string,
    number: codecs.number,
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('gives back existing but empty state by default ', () => {
    const { Component } = createContext();

    const { result } = renderHook(() => useQueryState(query), {
      wrapper: Component,
    });

    const [state] = result.current;
    expect(state).toEqual({ number: [], word: [] });
  });

  it('provides values from params', () => {
    const { Component } = createContext(['/path?word=foo&number=2&number=3']);

    const hook = renderHook(() => useQueryState(query), {
      wrapper: Component,
    });

    const [state] = hook.result.current;
    expect(state).toEqual({ number: [2, 3], word: ['foo'] });
  });

  it('provides values from params on initial render only', () => {
    const { Component, history } = createContext([
      '/path?word=foo&number=2&number=3',
    ]);

    const hook = renderHook(() => useQueryState(query), {
      wrapper: Component,
    });

    act(() => {
      history.pushState({}, '', '/path?word=foo&number=3');

      hook.rerender();
    });

    const [state] = hook.result.current;
    expect(state).toEqual({ number: [2, 3], word: ['foo'] });
  });

  it('updates state when set immediately', async () => {
    const { Component } = createContext(['/path?word=foo&number=2&number=3']);

    const hook = renderHook(() => useQueryState(query), {
      wrapper: Component,
    });

    const [, setState] = hook.result.current;

    act(() => {
      setState({
        word: ['bar'],
        number: [2],
      });
      hook.rerender();
    });

    const [state] = hook.result.current;
    expect(state).toEqual({ number: [2], word: ['bar'] });
  });

  it('does not update search params immediately', async () => {
    const { window, Component } = createContext([
      '/path?word=foo&number=2&number=3',
    ]);

    const hook = renderHook(() => useQueryState(query), {
      wrapper: Component,
    });

    const [, setState] = hook.result.current;

    act(() => {
      setState({
        word: ['bar'],
        number: [2],
      });
      hook.rerender();
    });

    expect(window.location.search).toEqual('?word=foo&number=2&number=3');
  });

  it('updates using replace when updating history', async () => {
    const { Component, history, window } = createContext([
      '/path?word=foo&number=2&number=3',
    ]);

    const queryHook = renderHook(() => useQueryState(query), {
      wrapper: Component,
    });

    expect(history.length).toBe(1);

    const [, setState] = queryHook.result.current;

    act(() => {
      setState({
        word: ['bar'],
        number: [2],
      });

      jest.advanceTimersByTime(250);

      queryHook.rerender();
    });

    expect(history.length).toBe(1);
    expect(window.location.search).toEqual('?word=bar&number=2');
  });

  it('does not contain unknown values', async () => {
    const { Component } = createContext(['/path?random=unknown&word=known']);

    const hook = renderHook(() => useQueryState(query), {
      wrapper: Component,
    });

    const [state] = hook.result.current;
    expect(state).toEqual({ number: [], word: ['known'] });
  });

  it('merges values with unknown', async () => {
    const { Component, window } = createContext([
      '/path?random=unknown&word=foo',
    ]);

    const queryHook = renderHook(() => useQueryState(query), {
      wrapper: Component,
    });

    const [, setState] = queryHook.result.current;

    act(() => {
      setState({
        word: ['bar'],
      });

      jest.advanceTimersByTime(250);

      queryHook.rerender();
    });

    expect(window.location.search).toEqual('?random=unknown&word=bar');
  });

  it('allows removing key by giving empty array', async () => {
    const { Component, window } = createContext([
      '/path?random=unknown&word=foo&number=21',
    ]);

    const queryHook = renderHook(() => useQueryState(query), {
      wrapper: Component,
    });

    const [, setState] = queryHook.result.current;

    act(() => {
      setState({
        number: [],
      });

      jest.advanceTimersByTime(250);

      queryHook.rerender();
    });

    expect(window.location.search).toEqual('?random=unknown&word=foo');
  });
});
