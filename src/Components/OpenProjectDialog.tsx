import type { DataGridProps, TableColumnDefinition } from "@fluentui/react-components";
import { Button, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, TableCellLayout, createTableColumn, makeStyles } from "@fluentui/react-components";
import { Delete24Filled, Delete24Regular, DocumentFlowchart24Filled, DocumentFlowchart24Regular, bundleIcon } from "@fluentui/react-icons";
import { compareAsc, formatDate } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Guid } from "@/Model/Guid";
import type { Project } from "@/Model/Project";
import { useStoreState } from "@/Store";

import type { DialogControllerProps } from "@/Hooks/Dialogs";
import { useDialog } from "@/Hooks/Dialogs";
import { Stack } from "./Stack";


export interface OpenProjectDialogProps {
	isOpen?: boolean;
	onProjectSelected?: (project: Project) => void;
	onDispose?: () => void;
}

export function OpenProjectDialog(props: OpenProjectDialogProps) 
{
	const { isOpen, onProjectSelected, onDispose } = props;

	const ProjectIcon = bundleIcon(DocumentFlowchart24Filled, DocumentFlowchart24Regular);
	const DeleteIcon = bundleIcon(Delete24Filled, Delete24Regular);
	const style = useStyles();

	const projects = useStoreState(state => state.projects.allProjects);

	const deleteDialog = useDialog(DeleteDialog);
	const deleteProject = useCallback(async (project: Project) => { await deleteDialog.show({ projectName: project.name }); }, [deleteDialog]);

	const columns = useMemo<TableColumnDefinition<Project>[]>(
		() => [
			createTableColumn<Project>({
				columnId: "name",
				compare: (a, b) => a.name.localeCompare(b.name),
				renderHeaderCell: () => "Project",
				renderCell: project => <TableCellLayout media={<ProjectIcon />}>{project.name}</TableCellLayout>,
			}),
			createTableColumn<Project>({
				columnId: "date",
				compare: (a, b) => compareAsc(a.lastModifiedOn, b.lastModifiedOn),
				renderHeaderCell: () => "Modified On",
				renderCell: project => <TableCellLayout>{formatDate(project.lastModifiedOn, "yyyy-MM-dd HH:mm:ss")}</TableCellLayout>,
			}),
			createTableColumn<Project>({
				columnId: "options",
				renderHeaderCell: () => "",
				renderCell: project => <TableCellLayout><Button appearance="subtle" icon={<DeleteIcon />} onClick={() => deleteProject(project)}></Button></TableCellLayout>,
			}),
		],
		[DeleteIcon, ProjectIcon, deleteProject],
	);

	const columnSizingOptions = {
		name: { minWidth: 280, defaultWidth: 280, idealWidth: 280 },
		date: { defaultWidth: 140, minWidth: 140, idealWidth: 140 },
		options: { defaultWith: 32, minWidth: 32, idealWidth: 32 },
	};

	const [selectedProjectId, setSelectedProjectId] = useState<Guid | undefined>();
	const selectedProject = useStoreState(state => selectedProjectId ? state.projects.getProjectById(selectedProjectId) : undefined);

	// clear selected project when dialog closes
	useEffect(() => { if (!isOpen) { setSelectedProjectId(undefined); } }, [isOpen]);

	const onSelectionChange = useCallback<NonNullable<DataGridProps["onSelectionChange"]>>((_, data) => 
	{
		const selectedId = data.selectedItems.size == 0 ? undefined : data.selectedItems.values().next().value;
		setSelectedProjectId(selectedId);
	}, []);
	const hasSelection = selectedProjectId !== undefined;

	const closeDialog = useCallback(() => { onDispose?.(); }, [onDispose]);
	const selectProject = useCallback(() => { if (selectedProject) { onProjectSelected?.(selectedProject); } }, [onProjectSelected, selectedProject]);


	return <>
		{isOpen && <Dialog open={isOpen ?? false}>
			<DialogSurface>
				<DialogBody>
					<DialogTitle>Open Project</DialogTitle>
					<DialogContent>
						<Stack className={style.projects}>
							<DataGrid items={projects} columns={columns} sortable selectionMode="single" subtleSelection onSelectionChange={onSelectionChange} getRowId={p => p.id} resizableColumns columnSizingOptions={columnSizingOptions}>
								<DataGridHeader>
									<DataGridRow>
										{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
									</DataGridRow>
								</DataGridHeader>
								<DataGridBody<Project>>
									{({ item, rowId }) => <DataGridRow<Project> key={rowId}>
										{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
									</DataGridRow>}
								</DataGridBody>
							</DataGrid>
						</Stack>
					</DialogContent>
					<DialogActions position="end">
						<Button appearance="secondary" onClick={closeDialog}>Cancel</Button>
						<Button appearance="primary" disabled={!hasSelection} onClick={selectProject}>Open</Button>
					</DialogActions>
				</DialogBody>
			</DialogSurface>
		</Dialog>}
	</>;
}

const useStyles = makeStyles({
	projects: {
		minHeight: "min(50vh, 300px)",
		overflowY: "auto",
	},
});

export interface DeleteDialogProps extends DialogControllerProps<boolean> {
	projectName: string,
}

export function DeleteDialog(props: DeleteDialogProps) 
{
	const { projectName, onDismiss, onConfirm } = props;

	return <Dialog open={true}>
		<DialogSurface>
			<DialogBody>
				<DialogTitle>Delete {projectName}</DialogTitle>
				<DialogContent></DialogContent>
				<DialogActions>
					<Button appearance="secondary" onClick={onDismiss}>Cancel</Button>
					<Button appearance="primary" onClick={() => onConfirm(true)}>Delete</Button>
				</DialogActions>
			</DialogBody>
		</DialogSurface>
	</Dialog>;
}