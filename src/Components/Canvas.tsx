import { Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { AppsListDetailFilled, AppsListDetailRegular, BookTemplateFilled, BookTemplateRegular, DeleteFilled, DeleteRegular, bundleIcon } from "@fluentui/react-icons";
import { useCallback } from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";

import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useDialog } from "@/Hooks/Dialogs";
import { useDesignerText, useSatisfactoryText } from "@/Hooks/Translations";
import { useStoreActions, useStoreState } from "@/Store";

import { hasValueNotFalse } from "@/Helpers";
import type { NodeId } from "@/Model/Node";
import type { RecipeKey } from "@/Model/Recipe";
import { Panel } from "./Panel";
import { RequestDialog } from "./RequestDialog";


export function Canvas() 
{
	const styles = useStyles();

	const nodes = useStoreState(state => state.nodes.allNodes);
	const { moveNodeByOffset, deleteNode } = useStoreActions(store => store.nodes);

	const database = useDatabase();
	const st = useSatisfactoryText();
	const dt = useDesignerText();

	const onNodeDropped = useCallback(
		(dragProps: { dragKey: NodeId }, monitor: DropTargetMonitor<NodeId, void>) => 
		{
			const offset = monitor.getDifferenceFromInitialOffset();
			if (dragProps && offset)
				moveNodeByOffset({ nodeId: dragProps.dragKey, offset });
		},
		[moveNodeByOffset],
	);

	const dialog = useDialog(RequestDialog, {
		title: dt("canvas.delete.dialogTitle"),
		message: dt("canvas.delete.dialogMessage"),
		okButton: dt("canvas.delete.dialogOkButton"), 
		cancelButton: dt("canvas.delete.dialogCancelButton") });
	const tryDeleteNode = useCallback(async (nodeId: NodeId) => 
	{
		await dialog.show({});
		deleteNode({ nodeId });
	}, [deleteNode, dialog]);

	const [, drop] = useDrop({
		accept: "Node",
		drop: onNodeDropped,
	});

	const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
	const VariantIcon = bundleIcon(AppsListDetailFilled, AppsListDetailRegular);
	const RecipeIcon = bundleIcon(BookTemplateFilled, BookTemplateRegular);

	const setRecipe = useStoreActions(store => store.nodes.setRecipe);

	return <div className={styles.root} ref={drop}>
		<div className={styles.canvas}>
			{nodes.map(node => 
			{
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const building = database.buildings.getByKey(node.buildingKey)!;

				const allowedRecipes = building.allowedRecipes?.map(key => database.recipes.getByKey(key)).filter(hasValueNotFalse) ?? [];
				const hasRecipes = allowedRecipes.length > 0;
				const selectedRecipe = hasRecipes && building.allowedRecipes && node.recipeKey ? database.recipes.getByKey(node.recipeKey) : undefined;

				return <div key={node.id} style={{ position: "absolute", left: node.position[0], top: node.position[1] }}>
					<Panel commands={<MenuList>
						{hasRecipes && <Menu hasCheckmarks
							checkedValues={{ variant: node.variantKey ? [node.variantKey] : [] }}
							onCheckedValueChange={(_ev, data) => { setRecipe({ nodeId: node.id, recipeKey: data.checkedItems[0] as RecipeKey }); }}>
							<MenuTrigger>
								<MenuItem icon={<RecipeIcon />} >Recipe</MenuItem>
							</MenuTrigger>
							<MenuPopover>
								<MenuList>
									{allowedRecipes.map(recipe => 
									{
										return <MenuItemRadio key={recipe.key} name="recipe" value={recipe.key}>
											{st(recipe.nameKey)}
										</MenuItemRadio>;
									})}
								</MenuList>
							</MenuPopover>
						</Menu>}
						<MenuItem icon={<DeleteIcon />} onClick={() => tryDeleteNode(node.id)} >{dt("canvas.delete.commandText")}</MenuItem>
					</MenuList>}
					dragKey={node.id}
					name={st(building.nameKey)}
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					description={selectedRecipe ? `Recipe: ${st(selectedRecipe.nameKey)}` : ""}
					imageUrl={building.imageUrl} />
				</div>;
			})}
		</div>
	</div>;
}


const useStyles = makeStyles({
	root: {
		position: "relative", // so children absolute are relative to this one
		width: "100%",
		height: "100%",
		backgroundColor: tokens.colorNeutralBackground4,
	},
	canvas: {
		position: "absolute",
		minWidth: "100%",
		minHeight: "100%",
		...shorthands.overflow("scroll"),
		backgroundSize: "16px 16px",
		backgroundImage: `
			linear-gradient(to right, #88888820 0.5px, transparent 1px),
			linear-gradient(to bottom, #88888820 0.5px, transparent 1px)
		`,
	},
});