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
export class ObjectPool {
    /**@type{Array<any>}*/
    pool;
    /**@type{Function}*/
    factory;
    /**@type{number}*/
    _ptr;
    /**@type{number}*/
    __under_lying_alloc;
    /**@type{EventTarget}*/
    _listener;

    constructor(factory,alloc_size) {
        this.pool = new Array(alloc_size);
        this.factory = factory;
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
            return this.pool[--this._ptr]
        }
        return this.factory();
    }
    returnToPool(item) {
        this.pool[this._ptr++] = item;
        console.log(this.pool);
    }
    /**
     * @param {Array<any>} items
     */
    returnToPoolBulk(items) {
        for(let j = 0; j < items.length; ++j, ++this._ptr) {
            this.pool[this._ptr] = items[j];
        }
    }
    async _onfree() {
        await free_pool(this);
    }
}
/**
 * Reset method to release the pool for GC
 * @param { ObjectPool } pool
 */
export async function free_pool(pool) {
    return new Promise(function(resolve, _reject) {
        pool.pool = new Array(pool.__under_lying_alloc);
        pool._ptr = 0;
        resolve();
    });
}