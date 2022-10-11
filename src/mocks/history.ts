type EventHandler = (event: Event) => void;

type Listener = {
  name: string;
  fn: EventHandler;
};

class EventEmitter {
  listeners: Listener[] = [];

  addEventListener(name: string, fn: EventHandler) {
    this.listeners.push({ name, fn });
  }

  removeEventListener(name: string, fn: EventHandler) {
    this.listeners = this.listeners.filter((listener) => {
      return listener.name !== name && listener.fn !== fn;
    });
  }

  emit(name: string, event: Event) {
    this.listeners.forEach((listener) => {
      if (name === listener.name) {
        listener.fn(event);
      }
    });
  }
}

globalThis.window.location = (new URL('http://mock') as unknown) as Location;

export class HistoryMock extends EventEmitter implements globalThis.History {
  scrollRestoration: ScrollRestoration = 'auto';
  state: any = {};

  baseURL = '';
  index = 0;
  entries: URL[] = [];

  constructor(entries: string[], baseURL = '') {
    super();

    this.baseURL = baseURL;
    this.entries = entries.map((url) => new URL(this.baseURL + url));
  }

  get length() {
    return this.entries.length;
  }

  go(delta: number) {
    this.index += delta;
    const url = this.entries[this.index];
    globalThis.window.location = (url as unknown) as Location;
    this.emit('popstate', new Event('popstate'));
  }

  forward() {
    this.go(1);
  }

  back() {
    this.go(-1);
  }

  pushState(_: any, __: string, url: string | URL): void {
    const location = new URL(this.baseURL + url);
    this.entries.splice(this.index + 1, this.entries.length, location);
    this.go(1);
  }

  replaceState(_: any, __: string, url: string | URL): void {
    const location = new URL(this.baseURL + url);
    this.entries.splice(this.index, 1, location);
    this.go(0);
  }
}
