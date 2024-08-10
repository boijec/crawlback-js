import net from 'net'
import { ObjectPool } from './global_bases.mjs';
import { parseIncoming, RequestFactory, TCPRequest } from './message_parser.mjs';
import { Worker } from 'worker_threads';

/** @type { ObjectPool<TCPRequest> } */
const REQ_OBJ_POOL = new ObjectPool(RequestFactory, 10);

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
        const worker = new Worker('./src/message_processor.mjs');
        /**
         * @param {Buffer|string} data
         */
        socket.on('data', function(data) {
            console.time('use-req');
            const req = REQ_OBJ_POOL.get();
            parseIncoming(data, req);
            // TODO: handle incoming (should be able to recv login ping and heartbeats on one continous socket)
            REQ_OBJ_POOL.returnToPool(req);
            console.timeEnd('use-req');
            socket.write(Buffer.from("Processed Data in\r\n"));
        });
        // TODO: more gracefull...
        socket.on('error', function() {
            socket.write(Buffer.from("test"), function() {
                socket.end()
            });
        });
        worker.on("message", function(buffer) {
            socket.write(buffer);
        });
        worker.postMessage('RDY');
    }
}