"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayMultimap = void 0;
const multimap_js_1 = require("./multimap.js");
class ArrayMultimap extends multimap_js_1.Multimap {
    constructor(iterable) {
        super(new ArrayOperator(), iterable);
    }
    get [Symbol.toStringTag]() {
        return "ArrayMultimap";
    }
}
exports.ArrayMultimap = ArrayMultimap;
class ArrayOperator {
    create() {
        return [];
    }
    clone(collection) {
        return collection.slice();
    }
    add(value, collection) {
        collection.push(value);
        return true;
    }
    size(collection) {
        return collection.length;
    }
    delete(value, collection) {
        const index = collection.indexOf(value);
        if (index > -1) {
            collection.splice(index, 1);
            return true;
        }
        return false;
    }
    has(value, collection) {
        return collection.includes(value);
    }
}
