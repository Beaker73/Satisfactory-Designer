import { Body1, Button, Caption1, Card, CardHeader, Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Tooltip, makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { BookTemplateFilled, BookTemplateRegular, BuildingFactoryFilled, BuildingFactoryRegular, DeleteFilled, DeleteRegular, MoreVerticalFilled, MoreVerticalRegular, bundleIcon } from "@fluentui/react-icons";
import { useCallback } from "react";
import { Fragment } from "react/jsx-runtime";

import { useDatabase } from "@/Hooks/DatabaseContext";
import { useDialog } from "@/Hooks/Dialogs";
import { useDesignerText, useSatisfactoryText } from "@/Hooks/Translations";
import type { Building, BuildingVariant, BuildingVariantKey, BuildingVariants } from "@/Model/Building";
import type { Recipe, RecipeKey } from "@/Model/Recipe";

import { Link } from "@/ComputeModel/Link";
import type { Node } from "@/ComputeModel/Node";
import type { Port } from "@/ComputeModel/Port";
import { useProject } from "@/ComputeModel/ProjectContext";
import { hasValueNotFalse } from "@/Helpers";
import { objectValues } from "@/Helpers/Object";
import type { DragData, DragPortData } from "@/Model/DragData";
import { observer } from "mobx-react-lite";
import type { DropTargetMonitor } from "react-dnd";
import { useDrag, useDrop } from "react-dnd";
import { RequestDialog } from "./RequestDialog";
import { Stack } from "./Stack";

export interface NodeCardProps {
	node: Node,
}

export const NodeCard = observer((props: NodeCardProps) =>
{
	const { node } = props;

	const st = useSatisfactoryText();
	const styles = useStyles();

	const building = node.building;
	const variant = node.variant;
	const recipe = node.recipe;

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
			{recipe?.inputs && <Ports node={node} recipe={recipe} ports={node.inputPorts} side="left" />}
		</div>
		<div className={styles.portsRight}>
			{recipe?.outputs && <Ports node={node} recipe={recipe} ports={node.outputPorts} side="right" />}
		</div>
	</div>;
});


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
	const variants = objectValues<BuildingVariants | undefined, BuildingVariantKey, BuildingVariant>(node?.building?.variants);
	const hasVariants = (variants?.length ?? 0) > 0;
	const recipes = database.recipes.getByKeys(building?.allowedRecipes);
	const hasRecipes = (recipes?.length ?? 0) > 0;

	return <Fragment>
		{node && hasVariants && <VariantMenuItem node={node} variants={variants} />}
		{node && hasRecipes && <RecipeMenuItem node={node} recipes={recipes} />}
		{node && <DeleteNodeMenuItem node={node} />}
	</Fragment>;
}

interface RecipeMenuItemProps {
	node: Node,
	recipes: Recipe[],
}

export const RecipeMenuItem = observer((props: RecipeMenuItemProps) =>
{
	const { node, recipes } = props;

	const RecipeIcon = bundleIcon(BookTemplateFilled, BookTemplateRegular);
	const st = useSatisfactoryText();

	return <Menu>
		<MenuTrigger>
			<MenuItem icon={<RecipeIcon />}>Recipe</MenuItem>
		</MenuTrigger>
		<MenuPopover>
			<MenuList hasCheckmarks
				checkedValues={{ recipe: node.recipe ? [node.recipe.key] : [] }}
				onCheckedValueChange={(_ev, data) => 
				{ 
					const recipe = recipes.find(r => r.key === data.checkedItems[0] as RecipeKey);
					node.recipe = recipe;
				}
				}>
				{recipes.map(recipe => <MenuItemRadio key={recipe.key} name="recipe" value={recipe.key}>
					{st(recipe.nameKey)}
				</MenuItemRadio>)}
			</MenuList>
		</MenuPopover>
	</Menu>;
});

export interface VariantMenuItemProps {
	node: Node,
	variants: BuildingVariant[],
}

export const VariantMenuItem = observer((props: VariantMenuItemProps) =>
{
	const { node, variants } = props;

	const VariantIcon = bundleIcon(BuildingFactoryFilled, BuildingFactoryRegular);
	const st = useSatisfactoryText();

	return <Menu>
		<MenuTrigger>
			<MenuItem icon={<VariantIcon />}>Variant</MenuItem>
		</MenuTrigger>
		<MenuPopover>
			<MenuList hasCheckmarks
				checkedValues={{ variant: node.variant? [node.variant.key] : [] }}
				onCheckedValueChange={(_ev, data) => 
				{ 
					if(node.building.variants) 
					{
						const variant = node.building.variants[data.checkedItems[0] as BuildingVariantKey];
						if(variant)
							node.variant = variant;
					}
				}
				}>
				{variants.map(variant => <MenuItemRadio key={variant.key} name="variant" value={variant.key}>
					{st(variant.nameKey)}
				</MenuItemRadio>)}
			</MenuList>
		</MenuPopover>
	</Menu>;
});

const DeleteNodeMenuItem = observer((props: NodeCardProps) =>
{
	const { node } = props;
	const project = useProject();

	const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

	const dt = useDesignerText();
	const dialog = useDialog(RequestDialog, {
		title: dt("canvas.delete.dialogTitle"),
		message: dt("canvas.delete.dialogMessage"),
		okButton: dt("canvas.delete.dialogOkButton"),
		cancelButton: dt("canvas.delete.dialogCancelButton"),
	});

	const tryDeleteNode = useCallback(
		async (node: Node) => 
		{
			await dialog.show({});
			project?.removeNode(node);
		},
		[dialog, project],
	);

	return <MenuItem icon={<DeleteIcon />} onClick={() => tryDeleteNode(node)} >{dt("canvas.delete.commandText")}</MenuItem>;
});

export interface PortsProps {
	node: Node,
	recipe: Recipe,
	ports: Port[],
	side: "left" | "right",
}

export const Ports = observer((props: PortsProps) =>
{
	const { node, recipe, ports, side } = props;

	return <Stack justify="center" gap={4}>
		{ports.filter(port => port.isVisible).map(port => 
			<PortLink key={port.id} port={port} node={node} recipe={recipe} side={side} />)}
	</Stack>;
});

export interface PortLinkProps {
	node: Node,
	port: Port,
	recipe: Recipe,
	side: "left" | "right"
}

export const PortLink = observer((props: PortLinkProps) =>
{
	const { port, node, recipe, side } = props;

	const project = useProject();
	const item = port.item;

	const canDrop = useCallback((source: DragData): boolean => 
	{
		if(source.type !== "port")
			return false;

		// cannot drop on use, if from same type of side. i.s. source to source or target to target
		if(source.side === side) 
			return false;

		// only matching ingriedents can be connected
		if(source.port.item !== port.item) 
			return false;
		if(source.port.tag !== port.tag) 
			return false;

		return true;
	}, [port.item, port.tag, side]);
	const drop = useCallback((item: DragData, monitor: DropTargetMonitor) => 
	{
		if(project && item.type === "port" && monitor.canDrop()) 
		{
			const link = Link.createBetween(item.port, port);
			project.addLink(link);
		}
	}, [port, project]);
	const [{ isOver, validTarget }, dropRef] = useDrop<DragData, unknown, {isOver: boolean, validTarget: boolean}>(() => ({
		accept: "port",
		canDrop,
		drop,
		collect: monitor => ({
			isOver: monitor.isOver(),
			validTarget: monitor.canDrop(),
		}),
	}));

	const [, dragRef] = useDrag<DragPortData>(() => ({
		type: "port",
		item: { type: "port", port, node, recipe, side },
	}));

	// combine the refs into a single
	const refs = useCallback((r: HTMLDivElement) => (dragRef(r), dropRef(r)), [dragRef, dropRef]);

	const styles = usePortStyles();
	const st = useSatisfactoryText();

	const tooltip = [
		st(item?.nameKey).replace(" ", "\u00A0"),
		`${port.itemsPerMinute}\u00A0p/m`,
		port.tag ? st(`item.tag.${port.tag}`) : undefined,
	]
		.filter(hasValueNotFalse)
		.join("\n");

	return <Tooltip content={tooltip} withArrow appearance="inverted" relationship="description" positioning={side === "left" ? "before" : "after"}>
		<div ref={refs} className={mergeClasses(styles.port, isOver && !validTarget ? styles.noDrop : undefined )}>
		</div>
	</Tooltip>;
});

const usePortStyles = makeStyles({
	port: {
		width: "8px",
		height: "8px",
		border: `solid 1px ${tokens.colorNeutralStrokeAccessible}`,
		borderRadius: "8px",
		backgroundColor: tokens.colorNeutralBackground1,
	},
	noDrop: {
		...shorthands.borderColor(tokens.colorPaletteRedBorder1),
	},
});
