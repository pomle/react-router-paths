export class HistoryMock implements globalThis.History {
  scrollRestoration: ScrollRestoration = 'auto';
  state: any = {};

  baseURL = '';
  index = 0;
  entries: URL[] = [];

  constructor(entries: string[], baseURL = '') {
    this.baseURL = baseURL;
    this.entries = entries.map((url) => new URL(this.baseURL + url));
  }

  get length() {
    return this.entries.length;
  }

  go(delta: number) {
    this.index += delta;
    const url = this.entries[this.index];
    globalThis.location.hash = url.hash;
    globalThis.location.search = url.search;
  }

  forward() {
    this.go(1);
  }

  back() {
    this.go(-1);
  }

  pushState(_: any, __: string, url: string | URL): void {
    const location = new URL(this.baseURL + url);
    this.entries.splice(this.index, this.entries.length, location);
    this.go(1);
  }

  replaceState(_: any, __: string, url: string | URL): void {
    const location = new URL(this.baseURL + url);
    this.entries.splice(this.index, 1, location);
    this.go(0);
  }
}
