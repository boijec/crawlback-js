import { GCFriendlyOBJ } from './global_bases.mjs';

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
    static HBR = new MessageType('HBR', '15');

    static LS = new MessageType('LS', '10');
    static LR = new MessageType('LR', '20');

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
    static fromStr(value) {
        for (const k in MessageType) {
            if (MessageType[k].key === value) {
                return MessageType[k];
            }
        }
    }
    getValue() {
        return this.value;
    }
}

export class TCPMessage extends GCFriendlyOBJ {
    /**@type{MessageType} */
    type;
    /**@type {Buffer} */
    payload;

    constructor() {
        super();
    }
    toBuffer() {
        const b = Buffer.alloc(32);
        this.type.getValue().copy(b, 0);
        this.payload.copy(b, 2);
        Buffer.from('\r\n').copy(b, 30);
        return b;
    }
}