import { parentPort } from 'worker_threads';
import fs from "fs";
import readLine from "readline";

export async function readF(startAt, MESSAGE_TARGET) {
    let skipLine = false;
    /**@type{number}*/
    let cursor = 0;
    const tempBuff = Buffer.alloc(32);
    if(!Number.isNaN(startAt)) skipLine = true;

    const rl = readLine.createInterface({
        input: fs.createReadStream('dummy-data.txt'),
        crlfDelay: Infinity,
        terminal: false
    });
    for await (const line of rl) {
        if(++cursor < startAt && skipLine) continue;
        Buffer.from(line).copy(tempBuff, 0);
        Buffer.from('\r\n').copy(tempBuff, 30);
        MESSAGE_TARGET.dispatchEvent(new CustomEvent('new-message', {detail:{"cursor":cursor,"buffer":tempBuff }}));
    }
}

