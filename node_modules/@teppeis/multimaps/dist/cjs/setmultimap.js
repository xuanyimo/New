"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetMultimap = void 0;
const multimap_js_1 = require("./multimap.js");
class SetMultimap extends multimap_js_1.Multimap {
    constructor(iterable) {
        super(new SetOperator(), iterable);
    }
    get [Symbol.toStringTag]() {
        return "SetMultimap";
    }
}
exports.SetMultimap = SetMultimap;
class SetOperator {
    create() {
        return new Set();
    }
    clone(collection) {
        return new Set(collection);
    }
    add(value, collection) {
        const prev = collection.size;
        collection.add(value);
        return prev !== collection.size;
    }
    size(collection) {
        return collection.size;
    }
    delete(value, collection) {
        return collection.delete(value);
    }
    has(value, collection) {
        return collection.has(value);
    }
}
