import { Multimap } from "./multimap.js";
export class SetMultimap extends Multimap {
    constructor(iterable) {
        super(new SetOperator(), iterable);
    }
    get [Symbol.toStringTag]() {
        return "SetMultimap";
    }
}
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
