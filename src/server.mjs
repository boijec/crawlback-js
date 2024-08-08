import net from 'net'
import { ObjectPool } from './global_bases.mjs';
import { parseIncoming, RequestFactory, TCPRequest } from './message_parser.mjs';

/** @type { ObjectPool<TCPRequest> } */
const REQ_OBJ_POOL = new ObjectPool(RequestFactory);

export class TCPApplication {
    constructor() {
        /** @type { net.Server } _server */
        this._server = net.createServer();
        /** @type { ServerConfig } config */
        this.config;
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
    constructor() {
        this.PORT = 8080;
        this.ADDR = '0.0.0.0';
    }
}

class TCPSocketHandler {
    /**
     * 
     * @param {net.Socket} socket
     */
    static onConnection(socket) {
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
            socket.write(Buffer.from("test"), function() {
                socket.end()
            });
        });
        // TODO: more gracefull...
        socket.on('error', function() {
            socket.write(Buffer.from("test"), function() {
                socket.end()
            });
        })
    }
}