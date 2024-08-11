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
 * @template T objects
 */
export class ObjectPool {
    /**@type{Array<T>}*/
    pool;
    /**@type{() => T}*/
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
    }
    /**
     * @param {Array<any>} items
     */
    returnToPoolBulk(items) {
        for(let j = 0; j < items.length; ++j, ++this._ptr) {
            this.pool[this._ptr] = items[j];
        }
    }
}