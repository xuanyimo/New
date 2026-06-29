"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Multimap = void 0;
class Multimap {
    constructor(operator, iterable) {
        this.size_ = 0;
        this.map = new Map();
        this.operator = operator;
        if (iterable) {
            for (const [key, value] of iterable) {
                this.put(key, value);
            }
        }
        return this;
    }
    get size() {
        return this.size_;
    }
    get(key) {
        const values = this.map.get(key);
        if (values) {
            return this.operator.clone(values);
        }
        else {
            return this.operator.create();
        }
    }
    put(key, value) {
        let values = this.map.get(key);
        if (!values) {
            values = this.operator.create();
        }
        if (!this.operator.add(value, values)) {
            return false;
        }
        this.map.set(key, values);
        this.size_++;
        return true;
    }
    putAll(arg1, arg2) {
        let pushed = 0;
        if (arg2) {
            const key = arg1;
            const values = arg2;
            for (const value of values) {
                this.put(key, value);
                pushed++;
            }
        }
        else if (arg1 instanceof Multimap) {
            for (const [key, value] of arg1.entries()) {
                this.put(key, value);
                pushed++;
            }
        }
        else {
            throw new TypeError("unexpected arguments");
        }
        return pushed > 0;
    }
    has(key) {
        return this.map.has(key);
    }
    hasEntry(key, value) {
        return this.operator.has(value, this.get(key));
    }
    delete(key) {
        this.size_ -= this.operator.size(this.get(key));
        return this.map.delete(key);
    }
    deleteEntry(key, value) {
        const current = this.get(key);
        if (!this.operator.delete(value, current)) {
            return false;
        }
        this.map.set(key, current);
        this.size_--;
        return true;
    }
    clear() {
        this.map.clear();
        this.size_ = 0;
    }
    keys() {
        return this.map.keys();
    }
    entries() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        function* gen() {
            for (const [key, values] of self.map.entries()) {
                for (const value of values) {
                    yield [key, value];
                }
            }
        }
        return gen();
    }
    values() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        function* gen() {
            for (const [, value] of self.entries()) {
                yield value;
            }
        }
        return gen();
    }
    forEach(callback, thisArg) {
        for (const [key, value] of this.entries()) {
            callback.call(thisArg === undefined ? this : thisArg, value, key, this);
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    asMap() {
        const ret = new Map();
        for (const key of this.keys()) {
            ret.set(key, this.operator.clone(this.get(key)));
        }
        return ret;
    }
}
exports.Multimap = Multimap;
