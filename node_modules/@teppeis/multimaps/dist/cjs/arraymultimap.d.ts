import { Multimap } from "./multimap.js";
export declare class ArrayMultimap<K, V> extends Multimap<K, V, V[]> {
    constructor(iterable?: Iterable<[K, V]>);
    get [Symbol.toStringTag](): string;
}
