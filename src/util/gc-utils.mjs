/**
 * Extension made to reset all the instances in-memory to prevent old object from leaking
 * @class
 */
export class GCFriendlyOBJ {
    reset() {
        Object.keys(this).forEach((k) => this[k] = null);
    }
}