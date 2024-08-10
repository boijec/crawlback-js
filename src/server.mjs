import net from 'net'
import { Worker } from 'worker_threads';
import {MessageType, TCPMessage} from "./message.mjs";

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
        const worker = new Worker('./src/workers/message_processor.mjs');
        /**
         * @param {Buffer|string} data
         */
        socket.on('data', function(data) {
            console.time('use-req');
            console.timeEnd('use-req');
            socket.write(Buffer.from("Processed Data in\r\n"));
        });
        // TODO: more graceful...
        socket.on('error', function() {
            const err = new TCPMessage();
            err.type = MessageType.ERS;
            err.payload = Buffer.from('ERROR OCCURRED');
            socket.write(err.toBuffer(), function() {
                socket.end()
            });
        });
        worker.on("message", function(buffer) {
            socket.write(buffer);
        });
        worker.postMessage('RDY');
    }
}