import { createCodec, createQuery } from '@pomle/paths';
import { createParser } from '../query';

const dateCodec = createCodec(
  (date: Date) => date.getTime().toString(),
  (param: string) => new Date(parseFloat(param)),
);

describe.only('Stable Query Parser', () => {
  const query = createQuery({
    date: dateCodec,
  });

  it('returns decoded arguments', () => {
    const parse = createParser(query);
    const values = parse('date=100000000&date=200000000');
    expect(values.date[0]).toEqual(new Date(100000000));
    expect(values.date[1]).toEqual(new Date(200000000));
  });

  it('maintains a reference to decoded argument when arg not changed', () => {
    const parse = createParser(query);
    const firstParse = parse('date=100000000');
    const secondParse = parse('date=100000000');
    expect(firstParse.date[0]).toBe(secondParse.date[0]);
  });

  it('returns a new reference to decoded argument when arg is changed', () => {
    const parse = createParser(query);
    const firstParse = parse('date=100000000');
    const secondParse = parse('date=200000000');
    expect(firstParse.date[0]).not.toBe(secondParse.date[0]);
  });

  it('returns a new reference even when args change back to previous known values', () => {
    const parse = createParser(query);
    const firstParse = parse('date=100000000');
    const secondParse = parse('date=200000000');
    const thirdParse = parse('date=100000000');
    expect(firstParse.date[0]).not.toBe(thirdParse.date[0]);
    expect(firstParse.date[0]).not.toBe(secondParse.date[0]);
    expect(secondParse.date[0]).not.toBe(thirdParse.date[0]);
  });

  it('forgets arguments that were removed', () => {
    const parse = createParser(query);
    const firstParse = parse('date=100000000&date=200000000');
    parse('');
    const thirdParse = parse('date=100000000&date=200000000');
    expect(firstParse.date[0]).not.toBe(thirdParse.date[0]);
    expect(firstParse.date[1]).not.toBe(thirdParse.date[1]);
  });

  it('continually returns stable refs while arguments do not change', () => {
    const parse = createParser(query);
    const firstParse = parse('date=100000000&date=200000000');
    const secondParse = parse('date=100000000&date=200000000');
    const thirdParse = parse('date=100000000&date=200000000');
    const fourthParse = parse('date=100000000&date=200000000');
    expect(secondParse.date[0]).toBe(firstParse.date[0]);
    expect(secondParse.date[1]).toBe(firstParse.date[1]);
    expect(thirdParse.date[0]).toBe(firstParse.date[0]);
    expect(thirdParse.date[1]).toBe(firstParse.date[1]);
    expect(fourthParse.date[0]).toBe(firstParse.date[0]);
    expect(fourthParse.date[1]).toBe(firstParse.date[1]);
  });

  it('returns stable arguments when other aspects change', () => {
    const parse = createParser(query);
    const firstParse = parse('date=100000000&date=200000000&date=1');
    const secondParse = parse('date=100000000&foo=bar&date=200000000');
    const thirdParse = parse('&foo=bar&foo=bar&date=100000000&date=200000000');
    const fourthParse = parse('date=100000000&date=200000000');
    expect(secondParse.date[0]).toBe(firstParse.date[0]);
    expect(secondParse.date[1]).toBe(firstParse.date[1]);
    expect(thirdParse.date[0]).toBe(firstParse.date[0]);
    expect(thirdParse.date[1]).toBe(firstParse.date[1]);
    expect(fourthParse.date[0]).toBe(firstParse.date[0]);
    expect(fourthParse.date[1]).toBe(firstParse.date[1]);
  });
});
