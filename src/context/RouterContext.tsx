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

type Router = {
  location: URL;
  history: History;
  window: BrowserWindow;
};

const Context = createContext<Router | null>(null);

interface RouterContextProps {
  history: BrowserHistory;
  children: React.ReactNode;
  window?: BrowserWindow;
}

export function RouterContext({
  children,
  history: source,
  window = globalThis.window,
}: RouterContextProps) {
  const createLocation = useCallback(() => {
    return new URL(window.location.href);
  }, [window]);

  const [location, setLocation] = useState<URL>(createLocation);

  const updateLocation = useCallback(() => {
    setLocation(createLocation);
  }, []);

  useEffect(() => {
    updateLocation();

    window.addEventListener('popstate', updateLocation);

    return () => {
      window.removeEventListener('popstate', updateLocation);
    };
  }, [updateLocation]);

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
  }, [source]);

  const value = {
    location,
    history,
    window,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useRouter() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useRouter without RouterContext');
  }
  return context;
}

export function useHistory() {
  return useRouter().history;
}

export function useLocation() {
  return useRouter().location;
}
