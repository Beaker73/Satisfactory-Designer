import { Body1, Button, Caption1, Card, CardHeader, Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Tooltip, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { BookTemplateFilled, BookTemplateRegular, BuildingFactoryFilled, BuildingFactoryRegular, DeleteFilled, DeleteRegular, MoreVerticalFilled, MoreVerticalRegular, bundleIcon } from "@fluentui/react-icons";
import { useCallback } from "react";
import { Fragment } from "react/jsx-runtime";

import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useDialog } from "@/Hooks/Dialogs";
import { useDesignerText, useSatisfactoryText } from "@/Hooks/Translations";
import type { Building, BuildingVariant, BuildingVariantKey, BuildingVariants } from "@/Model/Building";
import type { Node, NodeId } from "@/Model/Node";
import type { Ingredient, Recipe, RecipeKey } from "@/Model/Recipe";
import { useStoreActions, useStoreState } from "@/Store";

import { hasValueNotFalse } from "@/Helpers";
import { objectEntries, objectValues } from "@/Helpers/Object";
import type { KeyedRecord } from "@/Model/Identifiers";
import type { ItemKey } from "@/Model/Item";
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
	const name = variant ? `${st(building.nameKey)} ${st(variant.nameKey)}` : st(building.nameKey);
	const description = recipe ? st(recipe.nameKey) : undefined;

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
		<div className={styles.portsLeft}>
			{recipe?.inputs && <Ports recipe={recipe} items={recipe.inputs} side="left" />}
		</div>
		<div className={styles.portsRight}>
			{recipe?.outputs && <Ports recipe={recipe} items={recipe.outputs} side="right" />}
		</div>
	</div>;
}


const useStyles = makeStyles({
	root: {
		position: "relative", // set so child nodes that are absolute position, can be relative to this node
		margin: "-4px",
		padding: "4px",
	},
	portsLeft: {
		position: "absolute",
		left: "-1px", // extra pixel for border
		top: 0,
		height: "100%",
	},
	portsRight: {
		position: "absolute",
		right: "-1px", // extra pixel for border
		top: 0,
		height: "100%",
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
	const variants = objectValues<BuildingVariants | undefined, BuildingVariantKey, BuildingVariant>(database.buildings.getByKey(node?.buildingKey)?.variants);
	const hasVariants = (variants?.length ?? 0) > 0;
	const recipes = database.recipes.getByKeys(building?.allowedRecipes);
	const hasRecipes = (recipes?.length ?? 0) > 0;

	return <Fragment>
		{node && hasVariants && <VariantMenuItem node={node} variants={variants} />}
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

	const RecipeIcon = bundleIcon(BookTemplateFilled, BookTemplateRegular);
	const st = useSatisfactoryText();

	const setRecipe = useStoreActions(store => store.nodes.setRecipe);

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

export interface VariantMenuItemProps {
	node: Node,
	variants: BuildingVariant[],
}

export function VariantMenuItem(props: VariantMenuItemProps) 
{
	const { node, variants } = props;

	const VariantIcon = bundleIcon(BuildingFactoryFilled, BuildingFactoryRegular);
	const st = useSatisfactoryText();

	const setVariant = useStoreActions(store => store.nodes.setVariant);

	return <Menu>
		<MenuTrigger>
			<MenuItem icon={<VariantIcon />}>Variant</MenuItem>
		</MenuTrigger>
		<MenuPopover>
			<MenuList hasCheckmarks
				checkedValues={{ variant: node.variantKey ? [node.variantKey] : [] }}
				onCheckedValueChange={(_ev, data) => { setVariant({ nodeId: node.id, variantKey: data.checkedItems[0] as BuildingVariantKey }); }}
			>
				{variants.map(variant => <MenuItemRadio key={variant.key} name="variant" value={variant.key}>
					{st(variant.nameKey)}
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

export interface PortsProps {
	recipe: Recipe,
	items: KeyedRecord<ItemKey, Ingredient>,
	side: "left" | "right",
}

export function Ports(props: PortsProps) 
{
	const { recipe, items, side } = props;

	return <Stack justify="center" gap={4}>
		{objectEntries(items).map(([key, ingredient]) => 
			<Port key={key} recipe={recipe} ingredient={ingredient} side={side} />)}
	</Stack>;
}

export interface PortProps {
	recipe: Recipe,
	ingredient: Ingredient,
	side: "left" | "right"
}

export function Port(props: PortProps) 
{
	const { recipe, ingredient, side } = props;

	const styles = usePortStyles();
	const st = useSatisfactoryText();

	const database = useDatabase();
	const item = database.items.getByKey(ingredient.item);

	const tooltip = [
		st(item?.nameKey).replace(" ", "\u00A0"),
		`${60 / recipe.duration * ingredient.count}\u00A0p/m`,
		ingredient.tag ? st(`item.tag.${ingredient.tag}`) : undefined,
	]
		.filter(hasValueNotFalse)
		.join("\n");

	return <Tooltip content={tooltip} withArrow appearance="inverted" relationship="description" positioning={side === "left" ? "before" : "after"}>
		<div className={styles.port}>
		</div>
	</Tooltip>;
}

const usePortStyles = makeStyles({
	port: {
		width: "8px",
		height: "8px",
		border: `solid 1px ${tokens.colorNeutralStrokeAccessible}`,
		borderRadius: "8px",
		backgroundColor: tokens.colorNeutralBackground1,
	},
});
