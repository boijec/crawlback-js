import net from 'net'
import {MessageType, TCPMessage} from "./model/message.mjs";
import {MessageEventTarget} from "./model/message-event.mjs";
import {readF} from "./util/file-reader.mjs";
import {ObjectPool} from "./util/object-pool.mjs";

function TCPMessageFactory() {
    return new TCPMessage();
}
const store = new ObjectPool(TCPMessageFactory, 100)

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

class TCPSocketHandler {
    /**
     * 
     * @param {net.Socket} socket
     */
    static onConnection(socket) {
        const et = new MessageEventTarget();
        et.addEventListener('new-message', function(message) {
            if(message.detail.cursor % 100 === 0) {
                /**@type{TCPMessage}*/
                const hbs = store.get();
                hbs.type = MessageType.HBS;
                hbs.payload = Buffer.from("HeartBeat!");
                socket.write(hbs.toBuffer());
            }
            socket.write(message.detail.buffer);
        });
        /**
         * @param {Buffer|string} data
         */
        socket.on('data', async function(data) {
            await readF(Number.NaN, et);
        });
        socket.on('error', function() {
            const err = new TCPMessage();
            err.type = MessageType.ERS;
            err.payload = Buffer.from('ERROR OCCURRED');
            socket.write(err.toBuffer(), function() {
                socket.end()
            });
        });
    }
}