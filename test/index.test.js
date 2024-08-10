import { parseIncoming } from "../src/message_parser.mjs";

describe('Parse messages', () => {
  test('Parse standard message', () => {
    const s = parseIncoming('test');
    expect(s).toBe('test');
  });
});

// todo: write some additional artillery tests to send parralel requests to the server
// I'm guessing I'm gonna have to write the TCP socket client in here to test the thing, lol