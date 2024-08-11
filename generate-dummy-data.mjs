import fs from 'fs';
import { ObjectPool } from './src/util/object-pool.mjs';
import {MessageType, TCPMessage, TCPMessageFactory} from './src/model/message.mjs';

const store = new ObjectPool(TCPMessageFactory, 1)
const file = fs.createWriteStream('dummy-data.txt', {
    flags: 'a'
})

function randomMessage() {
    /**@type {TCPMessage} */
    const o = store.get();
    let direction = Math.floor(Math.random() * (4 - 1 + 1) + 1);
    switch(direction) {
        case 1:
            o.type = MessageType.MD;
            o.payload = Buffer.from('Character moved DOWN!');
            break;
        case 2:
            o.type = MessageType.MU;
            o.payload = Buffer.from('Character moved UP!');
            break;
        case 3:
            o.type = MessageType.MD;
            o.payload = Buffer.from('Character moved DOWN!');
            break;
        case 4:
            o.type = MessageType.MU;
            o.payload = Buffer.from('Character moved UP!');
            break;
    }
    return o;
}
console.time('create-file')
try {
    for(let i = 0; i < 1000000; i++) {
        const message = randomMessage();
        file.write(message.toBuffer());
        store.returnToPool(message);
    }
} catch (e) {
    console.error(e);
} finally {
    file.end();
}
console.timeEnd('create-file')
console.log(process.memoryUsage());