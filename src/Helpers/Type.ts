const tag = Symbol();
const subTag = Symbol();

export type Opaque<Base, Tag extends string, SubTag extends string | undefined = undefined> = SubTag extends undefined 
	? Base & { readonly [tag]: Tag } 
	: Base & { readonly [tag]: Tag, readonly [subTag]: SubTag };

