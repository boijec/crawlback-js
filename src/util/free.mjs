import {ObjectPool} from "./object-pool.mjs";
import {TrashCan} from "./trash-can.mjs";

/**
 * Reset method to release the pool for GC
 * @param { ObjectPool } pool
 * @param { TrashCan } trash
 * @param { boolean } force
 */
export function free(pool, trash, force = false) {
    if(force === true || trash.size() >= trash.max) {
        trash.empty();
        pool.pool = new Array(pool.__under_lying_alloc);
        pool._ptr = 0;
        return;
    }
    if(trash.surface().length >= pool.__under_lying_alloc) {
        pool.returnToPoolBulk(trash.surface());
        trash._add();
    }
}