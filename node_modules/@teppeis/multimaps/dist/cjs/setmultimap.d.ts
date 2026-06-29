import { Multimap } from "./multimap.js";
export declare class SetMultimap<K, V> extends Multimap<K, V, Set<V>> {
    constructor(iterable?: Iterable<[K, V]>);
    get [Symbol.toStringTag](): string;
}
