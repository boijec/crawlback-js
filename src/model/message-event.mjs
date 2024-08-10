export class MessageEventTarget extends EventTarget {
    constructor() {
        super();
    }
}
export const MESSAGE_EVENT_TARGET = new MessageEventTarget();