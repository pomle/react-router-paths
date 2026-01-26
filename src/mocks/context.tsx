import React from 'react';
import { RouterProvider } from '../context/RouterProvider';
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
      <RouterProvider history={history} window={window}>
        {children}
      </RouterProvider>
    );
  }

  return {
    Component,
    history,
    window,
  };
}
