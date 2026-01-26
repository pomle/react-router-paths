import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

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
const LocationContext = createContext<URL | null>(null);
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
  const createLocation = useCallback(() => {
    return new URL(window.location.href);
  }, [window]);

  const [location, setLocation] = useState<URL>(createLocation);

  const updateLocation = useCallback(() => {
    setLocation(createLocation);
  }, [createLocation]);

  useEffect(() => {
    updateLocation();

    window.addEventListener('popstate', updateLocation);

    return () => {
      window.removeEventListener('popstate', updateLocation);
    };
  }, [updateLocation, window]);

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
        <LocationContext.Provider value={location}>
          {children}
        </LocationContext.Provider>
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

export function useLocation() {
  const location = useContext(LocationContext);
  if (!location) {
    throw new Error('useLocation without RouterProvider');
  }
  return location;
}

export function useRouter() {
  return {
    location: useLocation(),
    history: useHistory(),
    window: useWindow(),
  };
}
