import {MessageEventTarget} from "../model/message-event.mjs";
import {MessageType, parseIncoming, TCPMessage} from "../model/message.mjs";
import {Socket} from "net";
import {readF} from "./file-reader.mjs";

export class TCPSocketHandler {
    static exitHandle = Buffer.from([0x17,0x0a]);
    /**
     *
     * @param {Socket} socket
     */
    static onConnection(socket) {
        let trap = { trapValue: false };
        const et = new MessageEventTarget();
        let params = {
            messageCursor: 0
        };
        const eosListener = function(message) {
            // clearInterval(interval);
            socket.write(message.detail.streamBuffer);
        };
        const newMessageListener = function(message) {
            if(message.detail.cursor) params.messageCursor = message.detail.cursor;
            socket.write(message.detail.streamBuffer);
        };
        // const heartBeatClosure = function() {
        //     et.dispatchEvent(new CustomEvent('new-message', {detail:{"streamBuffer":TCPMessage.HBS_MESSAGE().toBuffer()}}));
        // }
        et.addEventListener('new-message', newMessageListener);
        et.addEventListener('eos', eosListener);
        // let interval = setInterval(heartBeatClosure, 500);

        /**
         * @param {Buffer} data
         */
        socket.on('data', async function(data) {
            if(TCPSocketHandler.exitHandle.equals(data)) socket.emit('error');
            try {
                const [ message ] = parseIncoming(data);
                TCPSocketHandler.process(message, params, socket);
                if(params.startFlushing){
                    await readF(et, trap, 'dummy-data.txt', params.messageCursor);
                }
            } catch(e) {
                console.error(e);
                socket.emit('error');
            }
        });
        socket.on("close", function() {
            et.removeEventListener('new-message', newMessageListener);
            et.removeEventListener('eos', eosListener);
        });
        socket.on('error', function(error) {
            trap.trapValue = true;
            const err = TCPMessage.ERROR();
            socket.write(err.toBuffer());
            socket.end();
        });
    }

    static process(message, params, socket) {
        const body = message.payload.toString().replace(/\0/g, '');
        switch (message.type) {
            case MessageType.HBR:
                if(params.messageCursor > parseInt(body)){
                    console.warn(`Client is lagging behind! expected: ${params.messageCursor} - received: ${parseInt(body)}`);
                } else {
                    console.debug(`Client is in SYNC! expected: ${params.messageCursor} - received: ${parseInt(body)}`);
                }
                break;
            case MessageType.LR:
                const [username, password] = body.split(":");
                const response = new TCPMessage();
                if(username === "crawler" && password === "password") {
                    params.loggedIn = true;
                    response.type = MessageType.LS;
                    response.payload = Buffer.from('ACCEPTED');
                } else {
                    response.type = MessageType.LS;
                    response.payload = Buffer.from('DENIED');
                    socket.emit('error');
                }
                socket.write(response.toBuffer());
                break;
            case MessageType.SS:
                params.messageCursor = parseInt(body);
                // console.log(`DUMP WILL START AT SEQUENCE: ${params.messageCursor}`)
                params.startFlushing = true;
                break;
            default:
                console.log(`PROCESSING NOT IMPLEMENTED FOR: ${message.type}`);
        }
    }
}