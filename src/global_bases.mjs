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
 * Where a minimum eligible class is:
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
 * // let the pool instance it
 * const obj = OBJ_POOL.get();
 * obj.foo = 'test'
 * console.log(obj); // xba { foo: "test" }
 * // release the obj back to the pool
 * OBJ_POOL.returnToPool(obj); // calls obj.destroy();
 * ```
 * 
 * to free the ObjectPool
 * @see free_pool
 */
export class ObjectPool { // TODO: implement bulk-release back to pool
    /**
     * Object pool constructor
     * @param { Function } factory 
     * @param { number } alloc_size
     */
    constructor(factory,alloc_size) {
        this._pool = new Array(alloc_size);
        this._factory = factory;
        this._ptr = 0;
        this.__under_lying_alloc = alloc_size;

        this._listener = new EventTarget();
        this._listener.addEventListener('free', () => { this._onfree.bind(this) });
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
        // if((this._ptr + 1) > this.__under_lying_alloc) {
        //     this._listener.dispatchEvent(new CustomEvent('free'));
        //     return;
        // }
        this._pool[this._ptr++] = item;
    }
    _onfree() {
        console.log("freeing!");
        free_pool(this);
    }
}
/**
 * Reset method to release the pool for GC
 * @param { ObjectPool } pool 
 */
export function free_pool(pool) {
    pool._pool = new Array(pool.__under_lying_alloc);
    pool._ptr = 0;
}