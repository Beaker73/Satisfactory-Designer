import type { Opaque } from "@/Helpers/Type";
import { v4 } from "uuid";


export type Guid<T extends string | undefined = undefined> = Opaque<string, "Guid", T>;

/** Generates a new random guid */
export function newGuid<T extends string | undefined = undefined>(): Guid<T> { return v4() as unknown as Guid<T>; }



// eslint-disable-next-line @typescript-eslint/ban-types
export type Key<T extends string | undefined = undefined> = Opaque<string, "Key", T>;


/** record that is indexed by using opaque keys */
export type KeyedRecord<Indexer extends Key, Item> = Record<Indexer, Item>;