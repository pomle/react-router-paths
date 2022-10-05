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
};

const Context = createContext<Router | null>(null);

function createLocation() {
  return new URL(window.location.href);
}

interface RouterContextProps {
  history: BrowserHistory;
  children: React.ReactNode;
}

export function RouterContext({
  children,
  history: source,
}: RouterContextProps) {
  const [location, setLocation] = useState<URL>(createLocation);

  const updateLocation = useCallback(() => {
    setLocation(createLocation);
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', updateLocation);

    return () => {
      window.removeEventListener('popstate', updateLocation);
    };
  }, [updateLocation]);

  const history = useMemo(() => {
    return {
      push(url: URLCompatible) {
        source.pushState(null, '', url.toString());
        updateLocation();
      },
      replace(url: URLCompatible) {
        source.replaceState(null, '', url.toString());
        updateLocation();
      },
      go: source.go,
      back: source.back,
      forward: source.forward,
    };
  }, [source, updateLocation]);

  const value = {
    location,
    history,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useRouter() {
  const config = useContext(Context);
  if (!config) {
    throw new Error('useRouter without RouterContext');
  }
  return config;
}

export function useHistory() {
  return useRouter().history;
}

export function useLocation() {
  return useRouter().location;
}
