import type { DataGridProps, TableColumnDefinition } from "@fluentui/react-components";
import { Button, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, TableCellLayout, createTableColumn, makeStyles } from "@fluentui/react-components";
import { DeleteFilled, DeleteRegular, DocumentFlowchartFilled, DocumentFlowchartRegular, bundleIcon } from "@fluentui/react-icons";
import { compareAsc, formatDate } from "date-fns";
import { useCallback, useMemo, useState } from "react";

import type { Project, ProjectId } from "@/Model/Project";
import { useStoreActions, useStoreState } from "@/Store";

import type { DialogControllerProps } from "@/Hooks/Dialogs";
import { useDialog } from "@/Hooks/Dialogs";
import { Stack } from "./Stack";

/**
 * Returns a function that will open the 'open project' dialog.
 * @returns Function to open the 'open project' dialog.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useOpenProjectDialog() 
{
	const loadProject = useStoreActions(store => store.projects.loadProject);
	const openProject = useCallback((project: Project) => { loadProject({ project }); }, [loadProject]);

	const dialog = useDialog(OpenProjectDialog);
	return useCallback(
		async () => 
		{
			const project = await dialog.show({});
			openProject(project);
		},
		[dialog, openProject],
	);
}

export type OpenProjectDialogProps = DialogControllerProps<Project>;

export function OpenProjectDialog(props: OpenProjectDialogProps) 
{
	const { onConfirm, onDismiss } = props;

	const ProjectIcon = bundleIcon(DocumentFlowchartFilled, DocumentFlowchartRegular);
	const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);
	const style = useStyles();

	const activeProjectId = useStoreState(state => state.projects.activeProjectId);
	const projects = useStoreState(state => state.projects.allProjects);

	const deleteProject = useStoreActions(store => store.projects.deleteProject);
	const deleteDialog = useDialog(DeleteDialog);
	const showDeleteProjectDialog = useCallback(
		async (project: Project) => 
		{
			await deleteDialog.show({ projectName: project.name });
			deleteProject({ projectId: project.id });
		},
		[deleteDialog, deleteProject],
	);

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
				renderCell: project => <TableCellLayout>{project.id !== activeProjectId && <Button appearance="subtle" icon={<DeleteIcon />} onClick={() => showDeleteProjectDialog(project)}></Button>}</TableCellLayout>,
			}),
		],
		[DeleteIcon, ProjectIcon, activeProjectId, showDeleteProjectDialog],
	);

	const columnSizingOptions = {
		name: { minWidth: 280, defaultWidth: 280, idealWidth: 280 },
		date: { defaultWidth: 140, minWidth: 140, idealWidth: 140 },
		options: { defaultWith: 32, minWidth: 32, idealWidth: 32 },
	};

	const [selectedProjectId, setSelectedProjectId] = useState<ProjectId | undefined>();
	const selectedProject = useStoreState(state => selectedProjectId ? state.projects.getProjectById(selectedProjectId) : undefined);

	const onSelectionChange = useCallback<NonNullable<DataGridProps["onSelectionChange"]>>((_, data) => 
	{
		const selectedId = data.selectedItems.size == 0 ? undefined : data.selectedItems.values().next().value;
		setSelectedProjectId(selectedId);
	}, []);
	const canOpen = selectedProjectId !== undefined && selectedProjectId !== activeProjectId;

	const closeDialog = useCallback(() => { onDismiss?.(); }, [onDismiss]);
	const selectProject = useCallback(() => { if (selectedProject) { onConfirm?.(selectedProject); } }, [onConfirm, selectedProject]);


	return <Dialog open={true}>
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
					<Button appearance="primary" disabled={!canOpen} onClick={selectProject}>Open</Button>
				</DialogActions>
			</DialogBody>
		</DialogSurface>
	</Dialog>;
}

const useStyles = makeStyles({
	projects: {
		minHeight: "min(50vh, 300px)",
		overflowY: "auto",
	},
});

export interface DeleteDialogProps extends DialogControllerProps {
	projectName: string,
}

export function DeleteDialog(props: DeleteDialogProps) 
{
	const { projectName, onDismiss, onConfirm } = props;

	return <Dialog open={true}>
		<DialogSurface>
			<DialogBody>
				<DialogTitle>Delete {projectName}</DialogTitle>
				<DialogContent>
					<p>Are you sure you want to delete the project named &quot;{projectName}&quot;?</p>
					<p>This action cannot be undone</p></DialogContent>
				<DialogActions>
					<Button appearance="secondary" onClick={onDismiss}>Cancel</Button>
					<Button appearance="primary" onClick={() => onConfirm()}>Delete</Button>
				</DialogActions>
			</DialogBody>
		</DialogSurface>
	</Dialog>;
}