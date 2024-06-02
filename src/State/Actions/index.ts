import type { AddLinkAction } from "./AddLink";
import type { AddNodeAction } from "./AddNode";
import type { DeleteNodeAction } from "./DeleteNode";
import { type LoadProjectAction } from "./LoadProject";
import type { MoveNodeByOffsetAction } from "./MoveNodeByOffset";
import type { SetNodeRecipeAction } from "./SetNodeRecipe";
import type { SetNodeVariantAction } from "./SetNodeVariant";

export type Action<T extends string, P> = {
	type: T,
	payload: P,
};

export type ProjectAction =
	| LoadProjectAction
	| AddNodeAction
	| SetNodeRecipeAction
	| SetNodeVariantAction
	| MoveNodeByOffsetAction
	| AddLinkAction
	| DeleteNodeAction
	;
