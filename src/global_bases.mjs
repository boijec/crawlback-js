/**
 * Extension made to reset all the instances in-memory to prevent old object from leaking
 * @class
 */
export class GCFriendlyOBJ {
    reset() {
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
            return this._pool[--this._ptr]
        }
        return this._factory();
    }
    returnToPool(item) {
        this._pool[this._ptr++] = item;
    }
}