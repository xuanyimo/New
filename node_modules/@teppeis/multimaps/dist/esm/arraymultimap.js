import { Multimap } from "./multimap.js";
export class ArrayMultimap extends Multimap {
    constructor(iterable) {
        super(new ArrayOperator(), iterable);
    }
    get [Symbol.toStringTag]() {
        return "ArrayMultimap";
    }
}
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
