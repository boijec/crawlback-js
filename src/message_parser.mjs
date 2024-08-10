import { GCFriendlyOBJ } from "./global_bases.mjs";
/**
 * 
 * @param { Buffer } dataBuffer
 * @param { TCPRequest } requestObj
 * @returns { void }
 */
export function parseIncoming(dataBuffer, requestObj) {
    const buff = dataBuffer.toString(); // the buffer has already been parsed by the CPP engine
    // TODO: yeah.. no.. swap to wrapper on this.. course correcting, making a TCP feed not a web-server
    requestObj.method = 'GET';
    requestObj.path = '/'
    requestObj.Accept = 'application/json'
}

export class TCPRequest extends GCFriendlyOBJ {
    method;
    path;
    Accept;
    constructor() {
        super();
    }
}
export function RequestFactory() {
    return new TCPRequest();
}