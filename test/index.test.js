import {MessageType, TCPMessageFactory} from "../src/model/message.mjs";
import {ObjectPool} from "../src/util/object-pool.mjs";
import {TrashCan} from "../src/util/trash-can.mjs";
import {free} from "../src/util/free.mjs";

describe('Test internal functionality', () => {
  test('MessageType constructed from string', () => {
    const type = MessageType.fromStr('HBS');
    expect(type instanceof MessageType).toBe(true);
    expect(type).toBe(MessageType.HBS);
  });
  test('Test object pooling and cleanup', () => {
    const op = new ObjectPool(TCPMessageFactory, 5);
    const tbucket = new TrashCan(4);
    for(let i = 0; i < 20; i++) {
      const o = op.get();
      tbucket.discard(o);
      free(op, tbucket);
      if(i === 14) {
        expect(op.pool.length).toBe(5);
        expect(tbucket.size()).toBe(4)
        free(op,tbucket, true);
        expect(op._ptr).toBe(0);
        expect(op.pool.length).toBe(op.__under_lying_alloc);
        expect(tbucket.size()).toBe(0);
      }
    }
  });
});