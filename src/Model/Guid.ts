import { v4 } from "uuid";

const tag = Symbol();
export type Opaque<Base, Tag extends string> = Base & { readonly [tag]: Tag };

export type Guid = Opaque<string, "Guid">;

/** Generates a new random guid */
export function newGuid(): Guid { return v4() as Guid; }