import { GCFriendlyOBJ } from "./global_bases.mjs";
/**
 * 
 * @param { Buffer } dataBuffer
 * @param { TCPRequest } requestObj
 * @returns { void }
 */
export function parseIncoming(dataBuffer, requestObj) {
    console.time('data-buffer-conversion');
    const buff = dataBuffer.toString(); // the buffer has already been parsed by the CPP engine
    console.timeEnd('data-buffer-conversion');
    requestObj.method = 'GET';
    requestObj.path = '/'
    requestObj.Accept = 'application/json'
}

export class TCPRequest extends GCFriendlyOBJ {
    constructor() {
        super();
        this.method;
        this.path;
        this.Accept;
    }
}
export function RequestFactory() {
    return new TCPRequest();
}