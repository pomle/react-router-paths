import { renderHook } from '@testing-library/react-hooks';
import { createContext } from '../../mocks/context';
import { codecs, createQuery } from '@pomle/paths';
import { useQueryParams } from '../useQueryParams';
import { act } from 'react-test-renderer';

describe('useQueryParams', () => {
  it('gives back existing but empty params by default ', () => {
    const query = createQuery({
      word: codecs.string,
      number: codecs.number,
    });

    const { Component } = createContext();

    const { result } = renderHook(() => useQueryParams(query), {
      wrapper: Component,
    });

    const [params] = result.current;
    expect(params).toEqual({ number: [], word: [] });
  });

  it('provides values from params', () => {
    const query = createQuery({
      word: codecs.string,
      number: codecs.number,
    });

    const { Component } = createContext(['/path?word=foo&number=2&number=3']);

    const { result } = renderHook(() => useQueryParams(query), {
      wrapper: Component,
    });

    const [params] = result.current;
    expect(params).toEqual({ number: [2, 3], word: ['foo'] });
  });

  it('updates params when set called', async () => {
    const query = createQuery({
      word: codecs.string,
      number: codecs.number,
    });

    const { Component } = createContext(['/path?word=foo&number=2&number=3']);

    const hook = renderHook(() => useQueryParams(query), {
      wrapper: Component,
    });

    const [, setParams] = hook.result.current;

    act(() => {
      setParams({
        word: ['bar'],
        number: [2],
      });
      hook.rerender();
    });

    const [params] = hook.result.current;

    expect(params).toEqual({ number: [2], word: ['bar'] });
  });

  it('updates using replace when set called', async () => {
    const query = createQuery({
      word: codecs.string,
      number: codecs.number,
    });

    const { Component, history } = createContext([
      '/path?word=foo&number=2&number=3',
    ]);

    const queryHook = renderHook(() => useQueryParams(query), {
      wrapper: Component,
    });

    expect(history.length).toBe(1);

    const [, setParams] = queryHook.result.current;

    act(() => {
      setParams({
        word: ['bar'],
        number: [2],
      });
      queryHook.rerender();
    });

    expect(history.length).toBe(1);
  });

  it('does not contain unknown values', async () => {
    const query = createQuery({
      word: codecs.string,
      number: codecs.number,
    });

    const { Component } = createContext(['/path?random=unknown&word=known']);

    const hook = renderHook(() => useQueryParams(query), {
      wrapper: Component,
    });

    const [params] = hook.result.current;
    expect(params).toEqual({ number: [], word: ['known'] });
  });

  it('merges values with unknown', async () => {
    const query = createQuery({
      word: codecs.string,
      number: codecs.number,
    });

    const { Component, window } = createContext([
      '/path?random=unknown&word=foo',
    ]);

    const queryHook = renderHook(() => useQueryParams(query), {
      wrapper: Component,
    });

    const [, setParams] = queryHook.result.current;

    act(() => {
      setParams({
        word: ['bar'],
      });
      queryHook.rerender();
    });

    expect(window.location.search).toEqual('?random=unknown&word=bar');
  });

  it('allows removing values', async () => {
    const query = createQuery({
      word: codecs.string,
      number: codecs.number,
    });

    const { Component, window } = createContext([
      '/path?random=unknown&word=foo&number=21',
    ]);

    const queryHook = renderHook(() => useQueryParams(query), {
      wrapper: Component,
    });

    const [, setParams] = queryHook.result.current;

    act(() => {
      setParams({
        number: [],
      });
      queryHook.rerender();
    });

    expect(window.location.search).toEqual('?random=unknown&word=foo');
  });

  it('supports synchronous immediate updates', async () => {
    const query = createQuery({
      word: codecs.string,
      number: codecs.number,
    });

    const { Component, window } = createContext(['/path?word=foo&number=21']);

    const queryHook = renderHook(() => useQueryParams(query), {
      wrapper: Component,
    });

    const [, setParams] = queryHook.result.current;

    act(() => {
      setParams({
        number: [99],
      });
      setParams({
        word: ['bar'],
      });
      queryHook.rerender();
    });

    expect(window.location.search).toEqual('?word=bar&number=99');
  });
});
