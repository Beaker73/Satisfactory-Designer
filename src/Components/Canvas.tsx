import { useDatabase } from "@/Hooks/DatabaseProvider";
import { useDialog } from "@/Hooks/Dialogs";
import { useSatisfactoryText } from "@/Hooks/Translations";
import type { Guid } from "@/Model/Guid";
import { useStoreActions, useStoreState } from "@/Store";
import { Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { AppsListDetailFilled, AppsListDetailRegular, DeleteFilled, DeleteRegular, bundleIcon } from "@fluentui/react-icons";
import { useCallback } from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";
import { ContextPopup } from "./ContextPopup";
import { Node as NodeElement } from "./Node";
import { RequestDialog } from "./RequestDialog";


export function Canvas() 
{
	const styles = useStyles();

	const nodes = useStoreState(state => state.nodes.allNodes);
	const { moveNodeByOffset, setVariant, deleteNode } = useStoreActions(store => store.nodes);

	const database = useDatabase();
	const st = useSatisfactoryText();

	const onNodeDropped = useCallback(
		(dragProps: { dragKey: Guid }, monitor: DropTargetMonitor<Guid, void>) => 
		{
			const offset = monitor.getDifferenceFromInitialOffset();
			if (dragProps && offset)
				moveNodeByOffset({ nodeId: dragProps.dragKey, offset });
		},
		[moveNodeByOffset],
	);

	const dialog = useDialog(RequestDialog, { title: "Delete?", okButton: "Delete", cancelButton: "Cancel" });
	const tryDeleteNode = useCallback(async (nodeId: Guid) => 
	{
		await dialog.show({ message: "Are you sure you want to delete this node?" });
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
				const item = database.items.getByKey(node.itemKey)!;

				return <div key={node.id} style={{ position: "absolute", left: node.position[0], top: node.position[1] }}>
					<ContextPopup content={<MenuList>
						{item.variants && <Menu hasCheckmarks
							checkedValues={{ variant: node.variantKey ? [node.variantKey] : [] }}
							onCheckedValueChange={(_ev, data) => { setVariant({ nodeId: node.id, variantKey: data.checkedItems[0] }); }}>
							<MenuTrigger>
								<MenuItem icon={<VariantIcon />} >{st(item.variants.displayName)}</MenuItem>
							</MenuTrigger>
							<MenuPopover>
								<MenuList>
									{item.variants.types.map((variant, ix) => 
									{
										return <MenuItemRadio key={ix} name="variant" value={variant.key}>
											{st(variant.displayName)}
										</MenuItemRadio>;
									})}
								</MenuList>
							</MenuPopover>
						</Menu>}
						<MenuItem icon={<DeleteIcon />} onClick={() => tryDeleteNode(node.id)} >Delete</MenuItem>
					</MenuList>}>
						<NodeElement
							dragKey={node.id}
							name={st(item.displayName)}
							description={item.variants ? `${st(item.variants.displayName)}: ${st(item.variants.types.find(v => v.key === node.variantKey)!.displayName)}` : ""}
							imagePath={`images/${item.key}.png`} />
					</ContextPopup>
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
			linear-gradient(to right, ${tokens.colorNeutralStroke2} 0.5px, transparent 1px),
			linear-gradient(to bottom, ${tokens.colorNeutralStroke2} 0.5px, transparent 1px)
		`,
	},
});