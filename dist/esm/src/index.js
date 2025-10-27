/**
 * this is a set which automatically forgets
 * a given entry when a new entry is set and the ttl
 * of the old one is over
 */
export class ObliviousSet {
    ttl;
    map = new Map();
    /**
     * Creating calls to setTimeout() is expensive,
     * so we only do that if there is not timeout already open.
     */
    _to = false;
    constructor(ttl) {
        this.ttl = ttl;
    }
    has(value) {
        const valueTime = this.map.get(value);
        if (typeof valueTime === 'undefined') {
            return false;
        }
        if (valueTime < now() - this.ttl) {
            this.map.delete(value);
            return false;
        }
        return true;
    }
    add(value) {
        this.map.delete(value);
        this.map.set(value, now());
        /**
         * When a new value is added,
         * start the cleanup at the next tick
         * to not block the cpu for more important stuff
         * that might happen.
         */
        if (!this._to) {
            this._to = true;
            setTimeout(() => {
                this._to = false;
                removeTooOldValues(this);
            }, 0);
        }
    }
    clear() {
        this.map.clear();
    }
}
/**
 * Removes all entries from the set
 * where the TTL has expired
 */
export function removeTooOldValues(obliviousSet) {
    const olderThen = now() - obliviousSet.ttl;
    const iterator = obliviousSet.map[Symbol.iterator]();
    /**
     * Because we can assume the new values are added at the bottom,
     * we start from the top and stop as soon as we reach a non-too-old value.
     */
    while (true) {
        const next = iterator.next().value;
        if (!next) {
            break; // no more elements
        }
        const value = next[0];
        const time = next[1];
        if (time < olderThen) {
            obliviousSet.map.delete(value);
        }
        else {
            // We reached a value that is not old enough
            break;
        }
    }
}
export function now() {
    return Date.now();
}
//# sourceMappingURL=index.js.map