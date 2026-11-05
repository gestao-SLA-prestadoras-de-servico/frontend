import { motionMilliseconds } from './motion-timing';

describe('CSS motion durations in production', () => {
  it.each([
    ['900ms', 900],
    ['.9s', 900],
    [' 1.1s ', 1100],
    ['.07s', 70],
    ['0s', 0],
    ['', 800],
    ['invalid', 800],
    ['-1s', 800],
  ])('converts %s to %s milliseconds for WAAPI', (token, expected) => {
    expect(motionMilliseconds(token as string, 800)).toBe(expected);
  });
});
