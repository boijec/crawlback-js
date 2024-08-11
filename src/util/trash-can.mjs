export class TrashCan {
    cache = new Map();
    cachePtr = 1;
    /**@type{number} */
    max;

    constructor(max) {
        this.max = max;
    }

    _add() {
        this.cache.set(this.cachePtr++, []);
    }
    empty() {
        this.cache.clear();
        this.cachePtr = 1;
    }
    size() {
        return this.cache.size;
    }
    discard(obj) {
        if(this.surface() === undefined) this._add();
        this.surface().push(obj);
    }

    /**
     * @returns {Array<Object>}
     */
    surface() {
        return this.cache.get(this.cachePtr - 1);
    }
}