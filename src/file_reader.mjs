import fs from 'fs';
import readLine from 'readline';
import events from 'events';

export async function readTheThiny() {
    const stream = fs.createReadStream('dummy-data.txt');
    const rl = readLine.createInterface({
        input: stream,
        crlfDelay: Infinity,
        terminal: false
    });
    rl.on('line', async function(line) {
        console.log(`Line (buffer) from file: `, Buffer.from(line).length, Buffer.from(line));
        console.log(`Line from file: ${line}`);
        console.log('--------------------------------------------------------------------------------------------');
    });
    await events.once(rl, 'close');
}

readTheThiny()