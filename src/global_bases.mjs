/**
 * Extension made to reset all the instances in-memory to prevent old object from leaking
 * @class
 */
export class GCFriendlyOBJ {
    destroy() {
        Object.keys(this).forEach((k) => this[k] = null);
    }
}
/**
 * Create a factory by:
 * ```
 * function xbaObjectFactory() {
 *     return new xba();
 * }
 * ```
 * Where a minimum eligebale class is:
 * ```
 * class xba extends GCFriendlyObject {
 *    constructor() {
 *       this.foo;
 *    }
 * }
 * ```
 * 
 * Create object from pool:
 * ```
 * // declare pool
 * const OBJ_POOL = new ObjectPool(xbaObjectFactory);
 * // let the pool instanciate it
 * const obj = OBJ_POOL.get();
 * obj.foo = 'test'
 * console.log(obj); // xba { foo: "test" }
 * // release the obj back to the pool
 * OBJ_POOL.returnToPool(obj); // calls obj.destroy();
 * ```
 */
export class ObjectPool {
    /**
     * Object pool constructor
     * @param { Function } factory 
     */
    constructor(factory) {
        this._pool = new Array();
        this._factory = factory;
        this._ptr = 0;
    }
    /**
     * 
     * @returns { Object } new instance through the use of the constructed factory
     */
    get() {
        if(this._ptr > 0) {
            const o = this._pool[this._ptr-1]
            this._ptr--;
            return o;
        }
        return this._factory();
    }
    returnToPool(item) {
        item.destroy();
        this._pool[this._ptr++] = item;
    }
    /**
     * NOTE: not used at this time..
     * @param {Array<any>} items
     */
    returnToPoolBulk(items) {
        for(let n = 0; j < items.length; this._ptr++, n++) {
            this._pool[this._ptr] = items[n];
        }
    }
}