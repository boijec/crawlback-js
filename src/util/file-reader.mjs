import fs from "fs";
import readLine from "readline";
import {MessageType, TCPMessage} from "../model/message.mjs";

export async function readF(MESSAGE_TARGET, trp, streamFilename, startAt = 0, stopAt = Number.NaN) {
    let shouldStop = false;
    /**@type{number}*/
    let cursor = 0;
    const tempBuff = Buffer.alloc(32);
    tempBuff[30] = '0x0d'
    tempBuff[31] = '0x0a'
    if(!Number.isNaN(stopAt)) {
        shouldStop = true;
    }

    const readLineStream = readLine.createInterface({
        input: fs.createReadStream(streamFilename),
        crlfDelay: Infinity,
        terminal: false
    });
    for await (const messageRow of readLineStream) {
        if(trp.trapValue) return;
        if(++cursor < startAt) continue;
        tempBuff.write(messageRow);
        MESSAGE_TARGET.dispatchEvent(new CustomEvent('new-message', {detail:{"cursor":cursor-1,"streamBuffer":tempBuff}}));
        if(cursor === stopAt && shouldStop) return;
    }
    tempBuff.write(TCPMessage.EOS_MESSAGE().toString());
    MESSAGE_TARGET.dispatchEvent(new CustomEvent('new-message', {detail:{"cursor":cursor-1,"streamBuffer":tempBuff}}));
}

