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

  it('forgets references based on args that changed', () => {
    const parse = createParser(query);
    const firstParse = parse('date=100000000&date=350000000');
    const secondParse = parse('date=200000000');
    const thirdParse = parse('date=100000000&date=350000000');
    expect(firstParse.date[0]).not.toBe(thirdParse.date[0]);
    expect(firstParse.date[0]).not.toBe(secondParse.date[0]);
    expect(secondParse.date[0]).not.toBe(thirdParse.date[0]);
    expect(firstParse.date[1]).not.toBe(thirdParse.date[1]);
  });
});
