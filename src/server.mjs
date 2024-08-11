import net from 'net'
import {MessageType, TCPMessage, TCPMessageFactory} from "./model/message.mjs";
import {MessageEventTarget} from "./model/message-event.mjs";
import {readF} from "./util/file-reader.mjs";
import {ObjectPool} from "./util/object-pool.mjs";
import * as buffer from "node:buffer";

const store = new ObjectPool(TCPMessageFactory, 1)

export class TCPApplication {
    /** @type { net.Server } _server */
    _server;
    /** @type { ServerConfig } config */
    config;

    constructor() {
        this._server = net.createServer();
    }
    bootstrap() {
        this.config = new ServerConfig();
        this._server.on('connection', TCPSocketHandler.onConnection);
    }
    start() {
        this.bootstrap();
        this._server.listen(this.config.PORT, this.config.ADDR, this._serverHello.bind(this));
    }
    _serverHello() {
        console.log(`Server started listening on ${this.config.ADDR}:${this.config.PORT}!`);
    }
}
class ServerConfig {
    PORT = 8443;
    ADDR = '127.0.0.1';

    constructor() { // TODO: implement load from config file or env vars
        this.PORT = 8443;
        this.ADDR = '127.0.0.1';
    }
}
const exitHandle = Buffer.from([0x17,0x0a])
class TCPSocketHandler {
    /**
     * 
     * @param {net.Socket} socket
     */
    static onConnection(socket) {
        let trap = { trapValue: false };
        const et = new MessageEventTarget();


        et.addEventListener('new-message', function(message) {
            if(message.detail.cursor % 100 === 0) {
                socket.write(TCPMessage.HBS_MESSAGE().toBuffer());
            }
            socket.write(message.detail.streamBuffer);
        });
        /**
         * @param {Buffer|string} data
         */
        socket.on('data', function(data) {
            console.log(data);
            if(exitHandle.equals(data)) socket.emit('error');
            readF(et, trap, 'dummy-data.txt'); // no need to wait
        });
        socket.on('error', function(error) {
            trap.trapValue = true;
            const err = TCPMessage.ERROR();
            socket.write(err.toBuffer());
            socket.destroy();
        });
    }
}