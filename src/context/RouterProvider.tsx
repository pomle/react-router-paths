import React, { createContext, useContext, useMemo } from 'react';

type BrowserHistory = Pick<
  globalThis.History,
  'back' | 'forward' | 'go' | 'pushState' | 'replaceState'
>;

type BrowserWindow = Pick<
  globalThis.Window,
  'location' | 'addEventListener' | 'removeEventListener' | 'dispatchEvent'
>;

type URLCompatible = { toString(): string };

type History = {
  go(delta: number): void;
  forward(): void;
  back(): void;
  push(url: URLCompatible): void;
  replace(url: URLCompatible): void;
};

const WindowContext = createContext<BrowserWindow | null>(null);
const HistoryContext = createContext<History | null>(null);

interface RouterProviderProps {
  history: BrowserHistory;
  children: React.ReactNode;
  window?: BrowserWindow;
}

export function RouterProvider({
  children,
  history: source,
  window = globalThis.window,
}: RouterProviderProps) {
  const history = useMemo(() => {
    return {
      push(url: URLCompatible) {
        source.pushState(null, '', url.toString());
        window.dispatchEvent(new Event('popstate'));
      },
      replace(url: URLCompatible) {
        source.replaceState(null, '', url.toString());
        window.dispatchEvent(new Event('popstate'));
      },
      go: source.go.bind(source),
      back: source.back.bind(source),
      forward: source.forward.bind(source),
    };
  }, [source, window]);

  return (
    <WindowContext.Provider value={window}>
      <HistoryContext.Provider value={history}>
        {children}
      </HistoryContext.Provider>
    </WindowContext.Provider>
  );
}

export function useWindow() {
  const window = useContext(WindowContext);
  if (!window) {
    throw new Error('useWindow without RouterProvider');
  }
  return window;
}

export function useHistory() {
  const history = useContext(HistoryContext);
  if (!history) {
    throw new Error('useHistory without RouterProvider');
  }
  return history;
}

export function useRouter() {
  return {
    history: useHistory(),
    window: useWindow(),
  };
}
