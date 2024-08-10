import {MessageType} from "../src/model/message.mjs";

describe('Test internal functionality', () => {
  test('MessageType constructed from string', () => {
    const type = MessageType.fromStr('HBS');
    expect(type instanceof MessageType).toBe(true);
    expect(type).toBe(MessageType.HBS);
  });
});

// todo: write some additional artillery tests to send parralel requests to the server
// I'm guessing I'm gonna have to write the TCP socket client in here to test the thing, lol