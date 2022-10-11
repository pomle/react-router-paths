import React from 'react';
import { RouterContext } from '../context/RouterContext';
import { HistoryMock } from './history';

interface ContextProps {
  entries?: string[];
  children: React.ReactNode;
}

export function createContext(entries: string[] = ['/']) {
  const history = new HistoryMock(entries, 'http://mock-host');

  function Component({ children }: ContextProps) {
    return <RouterContext history={history}>{children}</RouterContext>;
  }

  return {
    Component,
    history,
    window: globalThis.window,
  };
}
