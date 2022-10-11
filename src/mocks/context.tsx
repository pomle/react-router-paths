import React from 'react';
import { RouterContext } from '../context/RouterContext';
import { createHistoryMock } from './history';

interface ContextProps {
  entries?: string[];
  children: React.ReactNode;
}

export function createContext(entries: string[] = ['/']) {
  const { history, window } = createHistoryMock(entries);
  history.go(0);

  function Component({ children }: ContextProps) {
    return (
      <RouterContext history={history} window={window}>
        {children}
      </RouterContext>
    );
  }

  return {
    Component,
    history,
    window,
  };
}
