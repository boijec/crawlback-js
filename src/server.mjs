import net from 'net'
import {TCPMessageFactory} from "./model/message.mjs";
import {ObjectPool} from "./util/object-pool.mjs";
import {TCPSocketHandler} from "./util/socket-handler.mjs";

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