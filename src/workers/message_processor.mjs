import { parentPort } from 'worker_threads';

parentPort.on('message', function(CMD) {
    switch(CMD) {
        case 'RDY':
            console.log("Start producing messages");
            parentPort.postMessage(Buffer.from("Dumping data\r\n"));
            break;
        default:
            console.log("PRODUCE ERROR EVENT");
            parentPort.postMessage(Buffer.from("ERR\r\n"));
    }
});