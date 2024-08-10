import fs from 'fs';
import { free_pool, ObjectPool } from "./src/global_bases.mjs";
import { MessageType, TCPMessage } from './src/message.mjs';

function TCPMessageFactory() {
    return new TCPMessage();
}
const store = new ObjectPool(TCPMessageFactory, 100)
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
            o.type = MessageType.MR;
            o.payload = Buffer.from('Character moved RIGHT!');
            break;
        case 3:
            o.type = MessageType.MU;
            o.payload = Buffer.from('Character moved UP!');
            break;
        case 4:
            o.type = MessageType.ML;
            o.payload = Buffer.from('Character moved LEFT!');
            break;
    }
    return o;
}

for(let i = 0; i < 3000000; i++) {
    const message = randomMessage();
    try {
        file.write(message.toBuffer());
        store.returnToPool(message);
    } catch(e) {
        console.error(e);
    }
}
file.end();
free_pool(store);