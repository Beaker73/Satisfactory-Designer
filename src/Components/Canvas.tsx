import { Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { AppsListDetailFilled, AppsListDetailRegular, DeleteFilled, DeleteRegular, bundleIcon } from "@fluentui/react-icons";
import { useCallback } from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";

import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useDialog } from "@/Hooks/Dialogs";
import { useDesignerText, useSatisfactoryText } from "@/Hooks/Translations";
import type { Guid } from "@/Model/Guid";
import { useStoreActions, useStoreState } from "@/Store";

import { Panel } from "./Panel";
import { RequestDialog } from "./RequestDialog";


export function Canvas() 
{
	const styles = useStyles();

	const nodes = useStoreState(state => state.nodes.allNodes);
	const { moveNodeByOffset, setVariant, deleteNode } = useStoreActions(store => store.nodes);

	const database = useDatabase();
	const st = useSatisfactoryText();
	const dt = useDesignerText();

	const onNodeDropped = useCallback(
		(dragProps: { dragKey: Guid }, monitor: DropTargetMonitor<Guid, void>) => 
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
	const tryDeleteNode = useCallback(async (nodeId: Guid) => 
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

	return <div className={styles.root} ref={drop}>
		<div className={styles.canvas}>
			{nodes.map(node => 
			{
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const item = database.items.getByKey(node.itemKey)!;
				const variants = item.variants ? database.variants.getByKey(item.variants) : undefined;
				const hasVariants = !!variants;

				return <div key={node.id} style={{ position: "absolute", left: node.position[0], top: node.position[1] }}>
					<Panel commands={<MenuList>
						{hasVariants && <Menu hasCheckmarks
							checkedValues={{ variant: node.variantKey ? [node.variantKey] : [] }}
							onCheckedValueChange={(_ev, data) => { setVariant({ nodeId: node.id, variantKey: data.checkedItems[0] }); }}>
							<MenuTrigger>
								<MenuItem icon={<VariantIcon />} >{st(variants.displayName)}</MenuItem>
							</MenuTrigger>
							<MenuPopover>
								<MenuList>
									{variants.types.map((variant, ix) => 
									{
										return <MenuItemRadio key={ix} name="variant" value={variant.key}>
											{st(variant.displayName)}
										</MenuItemRadio>;
									})}
								</MenuList>
							</MenuPopover>
						</Menu>}
						<MenuItem icon={<DeleteIcon />} onClick={() => tryDeleteNode(node.id)} >{dt("canvas.delete.commandText")}</MenuItem>
					</MenuList>}
					dragKey={node.id}
					name={st(item.displayName)}
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					description={variants ? `${st(variants.displayName)}: ${st(variants.types.find(v => v.key === (node.variantKey ?? variants.default))!.displayName)}` : ""}
					imagePath={`images/${item.key}.png`} />
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