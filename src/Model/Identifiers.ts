import type { Opaque } from "@/Helpers/Type";
import { v4 } from "uuid";

/** A string containing of formatted guid */
export type Guid<T extends string | undefined = undefined> = Opaque<string, "Guid", T>;

/** Generates a new random guid */
export function newGuid<
	G extends Guid | string | undefined = undefined,
>(): G extends Guid<infer T extends string> ? Guid<T> : G extends string ? Guid<G> : Guid
{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return v4() as any;
}

/** A string key that behaves like a unqiue identifier for type T */
export type Key<T extends string | undefined = undefined> = Opaque<string, "Key", T>;


/** record that is indexed by using opaque keys */
export type KeyedRecord<Indexer extends Key, Item> = Record<Indexer, Item>;