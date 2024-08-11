import {Socket} from "net";
import {MessageType, parseIncoming, TCPMessage} from "./src/model/message.mjs";

const client = new Socket();
let barometer = 0;
let message_counter = 0;
const heartBeatPacket = new TCPMessage();
let eos = 0;

client.on('data', function(data) {
    const oList = parseIncoming(data);
    for(let o of oList) {
        const body = o.payload.toString().replace(/\0/g, '');
        switch (o.type) {
            case MessageType.HBS:
                heartBeatPacket.type = MessageType.HBR;
                heartBeatPacket.payload = Buffer.from(`${message_counter}`);
                client.write(heartBeatPacket.toBuffer());
                break;
            case MessageType.ERS:
                console.log("Error in feed!:", body);
                break;
            case MessageType.LS:
                if(body === "ACCEPTED") {
                    const setSequencePacket = new TCPMessage();
                    setSequencePacket.type = MessageType.SS;
                    setSequencePacket.payload = Buffer.from('0');
                    client.write(setSequencePacket.toBuffer());
                } else client.end();
                break;
            case MessageType.EOS:
                console.log("End of Dump received: ", body);
                client.end();
                break;
            case MessageType.MD:
                barometer--;
                message_counter++;
                break;
            case MessageType.MU:
                barometer++;
                message_counter++;
                break;
            default:
                break;
        }
    }
});
client.on('error', function(error) {
    console.log("Err Received: ", error)
    client.end();
});
client.on('close', function() {
    console.log(`Barometer finished at: ${barometer}`);
    console.log(`Message counter: ${message_counter}`);
    console.log(`EOS times: ${eos}`);
    console.timeEnd('processing')
});
client.connect(8443, '127.0.0.1', function() {
    console.time('processing')
    const login = new TCPMessage();
    login.type = MessageType.LR;
    login.payload = Buffer.from('crawler:password');
    client.write(login.toBuffer());
});
