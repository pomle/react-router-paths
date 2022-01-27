import React from 'react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

interface ContextProps {
  entries?: string[];
  children: React.ReactNode;
}

export function createContext(entries?: string[]) {
  const history = createMemoryHistory({ initialEntries: entries });

  function Component({ children }: ContextProps) {
    return <Router history={history}>{children}</Router>;
  }

  return {
    Component,
    history,
  };
}
