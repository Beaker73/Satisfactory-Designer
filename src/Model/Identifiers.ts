import type { Opaque } from "@/Helpers/Type";
import { v4 } from "uuid";

/** A string containing of formatted guid */
export type Guid<T extends string | undefined = undefined> = Opaque<string, "Guid", T>;

/** Generates a new random guid */
export function newGuid<T extends string | undefined = undefined>(): Guid<T> { return v4() as unknown as Guid<T>; }


/** A string key that behaves like a unqiue identifier for type T */
export type Key<T extends string | undefined = undefined> = Opaque<string, "Key", T>;


/** record that is indexed by using opaque keys */
export type KeyedRecord<Indexer extends Key, Item> = Record<Indexer, Item>;