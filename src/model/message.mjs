export class MessageType {
    /**@type {string} */
    key;
    /**@type {Buffer} */
    value;

    constructor(key, value) {
        this.key = key;
        this.value = Buffer.from(value);
        Object.freeze(this);
    }

    static HBS = new MessageType('HBS', '05');
    static HBR = new MessageType('HBR', '15'); // client->server

    static LR = new MessageType('LR', '10'); // client->server
    static LS = new MessageType('LS', '20');
    static SS = new MessageType('SS', '30'); // client->server

    static EOS = new MessageType('EOS', '98');
    static ERS = new MessageType('ERS', '99');

    static MU = new MessageType('MU', '11');
    static MD = new MessageType('MD', '12');
    static ML = new MessageType('ML', '13');
    static MR = new MessageType('MR', '14');

    toString() {
        return this.key;
    }
    /**
     *
     * @param {string} value
     * @returns {MessageType}
     */
    static fromKeyStr(value) {
        for (const k in MessageType) {
            if (MessageType[k].key === value) {
                return MessageType[k];
            }
        }
        throw new Error(`Invalid message key: ${value}`);
    }
    static fromStr(value) {
        for (const k in MessageType) {
            if (MessageType[k].value.toString() === value) {
                return MessageType[k];
            }
        }
        throw new Error(`Invalid message value: ${value}`);
    }
    getValue() {
        return this.value;
    }
}
export class TCPMessage {
    /**@type{MessageType} */
    type;
    /**@type {Buffer} */
    payload;
    static footer = Buffer.from([0x0d, 0x0a]);

    static EOS_MESSAGE = function() {
        const o = new TCPMessage();
        o.type = MessageType.EOS;
        o.payload = Buffer.from("END_OF_DUMP");
        return o;
    }
    static HBS_MESSAGE = function() {
        const o = new TCPMessage();
        o.type = MessageType.HBS;
        o.payload = Buffer.from("HEARTBEAT_REQ");
        return o;
    }
    static ERROR = function() {
        const o = new TCPMessage();
        o.type = MessageType.ERS;
        o.payload = Buffer.from("ERROR_OCCURRED")
        return o;
    }
    constructor() {}
    toString() {
        return `${this.type.getValue()}${this.payload}`
    }
    toBuffer() {
        const b = Buffer.alloc(32);
        this.type.getValue().copy(b, 0);
        this.payload.copy(b, 2);
        TCPMessage.footer.copy(b, 30);
        return b;
    }
}
export function TCPMessageFactory() {
    return new TCPMessage();
}
/**
 * @param {Buffer} buffer
 * @returns Array<TCPMessage>
 */
export function parseIncoming(buffer) {
    let zeroPtr = 0;
    const msgAmount = buffer.length / 32
    const messageArr = [];
    for(let i = 0; i < msgAmount; i++) {
        const o = new TCPMessage();
        o.type = MessageType.fromStr(buffer.subarray(zeroPtr, zeroPtr+2).toString());
        o.payload = buffer.subarray(zeroPtr+2, zeroPtr+29);
        messageArr.push(o);
        zeroPtr += 32;
    }
    return messageArr;
}