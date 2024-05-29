import { Body1, Button, Caption1, Card, CardHeader, Label, Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Tooltip, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { BookTemplateFilled, BookTemplateRegular, DeleteFilled, DeleteRegular, MoreVerticalFilled, MoreVerticalRegular, bundleIcon } from "@fluentui/react-icons";
import { useCallback } from "react";
import { Fragment } from "react/jsx-runtime";

import { hasValue } from "@/Helpers";
import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useDialog } from "@/Hooks/Dialogs";
import { useDesignerText, useSatisfactoryText } from "@/Hooks/Translations";
import type { Building, BuildingVariant } from "@/Model/Building";
import type { Node, NodeId } from "@/Model/Node";
import type { Recipe, RecipeKey } from "@/Model/Recipe";
import { useStoreActions, useStoreState } from "@/Store";

import { objectEntries } from "@/Helpers/Object";
import type { KeyedRecord } from "@/Model/Identifiers";
import type { Item, ItemKey } from "@/Model/Item";
import { RequestDialog } from "./RequestDialog";
import { Stack } from "./Stack";

export interface NodeCardProps {
	nodeId: NodeId,
}

export function NodeCard(props: NodeCardProps) 
{
	const { nodeId } = props;
	const node = useStoreState(state => state.nodes.getById(nodeId));

	const st = useSatisfactoryText();
	const styles = useStyles();

	const { buildingKey, recipeKey, variantKey } = node;

	const database = useDatabase();
	const building = database.buildings.getByKey(buildingKey);
	const variant = building?.variants && variantKey ? building.variants[variantKey] : undefined;
	const recipe = recipeKey ? database.recipes.getByKey(recipeKey) : undefined;

	console.debug("node: 1", { node });
	const commands = useNodeCommands(node, building, variant, recipe);

	if (!node || !building)
		return <Fragment />;

	const MoreIcon = bundleIcon(MoreVerticalFilled, MoreVerticalRegular);

	const imageUrl = building.imageUrl;
	const name = st(building.nameKey);
	const description = [variant ? st(variant.nameKey) : undefined, recipe ? st(recipe.nameKey) : undefined].filter(hasValue).join(", ");

	return <div className={styles.root}>
		<Card orientation="horizontal" className={styles.node}>
			<CardHeader
				image={imageUrl ? <img className={styles.preview} src={imageUrl} /> : undefined}
				header={<Body1 className={styles.title}>{name}</Body1>}
				description={<Caption1>{description}</Caption1>}
				action={commands ? <Menu>
					<MenuTrigger>
						<Button appearance="subtle" icon={<MoreIcon />} />
					</MenuTrigger>
					<MenuPopover>
						<MenuList>
							{commands}
						</MenuList>
					</MenuPopover>
				</Menu> : undefined}
			>
			</CardHeader>
		</Card>
		{recipe?.inputs && <Ports recipe={recipe} items={recipe.inputs} side="left"  />}
		{recipe?.outputs && <Ports recipe={recipe} items={recipe.outputs} side="right" />}
	</div>;
}


const useStyles = makeStyles({
	root: {
		position: "relative", // set so child nodes that are absolute position, can be relative to this node
	},
	node: {
		width: "256px",
		height: "64px",
	},
	preview: {
		height: "40px", // 32px + 2*4px
		...shorthands.margin("-4px"), // make image larger, but not container
	},
	title: {
		fontWeight: tokens.fontWeightSemibold,
	},
});

function useNodeCommands(node?: Node, building?: Building, _variant?: BuildingVariant, _recipe?: Recipe) 
{
	const database = useDatabase();
	const recipes = database.recipes.getByKeys(building?.allowedRecipes);
	const hasRecipes = (recipes?.length ?? 0) > 0;

	return <Fragment>
		{node && hasRecipes && <RecipeMenuItem node={node} recipes={recipes} />}
		{node && <DeleteNodeMenuItem nodeId={node.id} />}
	</Fragment>;
}

interface RecipeMenuItemProps {
	node: Node,
	recipes: Recipe[],
}

export function RecipeMenuItem(props: RecipeMenuItemProps) 
{
	const { node, recipes } = props;
	console.debug("node: 2", { node, props });

	const RecipeIcon = bundleIcon(BookTemplateFilled, BookTemplateRegular);
	const st = useSatisfactoryText();

	const setRecipe = useStoreActions(store => store.nodes.setRecipe);
	console.debug("recipes", recipes);

	return <Menu>
		<MenuTrigger>
			<MenuItem icon={<RecipeIcon />}>Recipe</MenuItem>
		</MenuTrigger>
		<MenuPopover>
			<MenuList hasCheckmarks
				checkedValues={{ variant: node.variantKey ? [node.variantKey] : [] }}
				onCheckedValueChange={(_ev, data) => { setRecipe({ nodeId: node.id, recipeKey: data.checkedItems[0] as RecipeKey }); }}
			>
				{recipes.map(recipe => <MenuItemRadio key={recipe.key} name="recipe" value={recipe.key}>
					{st(recipe.nameKey)}
				</MenuItemRadio>)}
			</MenuList>
		</MenuPopover>
	</Menu>;
}

function DeleteNodeMenuItem(props: NodeCardProps) 
{
	const { nodeId } = props;

	const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

	const deleteNode = useStoreActions(store => store.nodes.deleteNode);

	const dt = useDesignerText();
	const dialog = useDialog(RequestDialog, {
		title: dt("canvas.delete.dialogTitle"),
		message: dt("canvas.delete.dialogMessage"),
		okButton: dt("canvas.delete.dialogOkButton"),
		cancelButton: dt("canvas.delete.dialogCancelButton"),
	});

	const tryDeleteNode = useCallback(
		async (nodeId: NodeId) => 
		{
			await dialog.show({});
			deleteNode({ nodeId });
		},
		[deleteNode, dialog],
	);

	return <MenuItem icon={<DeleteIcon />} onClick={() => tryDeleteNode(nodeId)} >{dt("canvas.delete.commandText")}</MenuItem>;
}

export interface PortsProps 
{
	recipe: Recipe,
	items: KeyedRecord<ItemKey, number>,
	side: "left" | "right",
}

export function Ports(props: PortsProps) 
{
	const { recipe, items, side } = props;
	const database = useDatabase();

	return <Stack>
		{objectEntries(items).map(([key, count]) => 
		{
			const item = database.items.getByKey(key);
			if(!item)
				return undefined;
			return <Port key={key} recipe={recipe} item={item} count={count} side={side} />;
		})}
	</Stack>;
}

export interface PortProps {
	recipe: Recipe,
	item: Item,
	count: number,
	side: "left" | "right"
}

export function Port(props: PortProps) 
{
	const { recipe, item, count, side } = props;

	const styles = usePortStyles();
	const st = useSatisfactoryText();

	const tooltip = <Stack>
		<Label>{st(item.nameKey)}</Label>
		<Label>{60 / recipe.duration * count}&nbsp;p/m</Label>
	</Stack>;

	return <Tooltip content={tooltip} withArrow relationship="description" positioning={side === "left" ? "before" : "after" }>
		<div className={styles.port}>
		</div>
	</Tooltip>;
}

const usePortStyles = makeStyles({
	port: {
		width: "8px",
		height: "8px",
		border: `solid 1px ${tokens.colorNeutralStroke1}`,
		borderRadius: "8px",
		backgroundColor: tokens.colorNeutralBackground4,
	},
});