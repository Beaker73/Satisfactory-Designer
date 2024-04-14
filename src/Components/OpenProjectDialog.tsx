import type { DataGridProps, TableColumnDefinition } from "@fluentui/react-components";
import { Button, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, TableCellLayout, createTableColumn, makeStyles } from "@fluentui/react-components";
import { DocumentFlowchart24Filled, DocumentFlowchart24Regular, bundleIcon } from "@fluentui/react-icons";
import { compareAsc, formatDate } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Guid } from "@/Model/Guid";
import type { Project } from "@/Model/Project";
import { useStoreState } from "@/Store";

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
	const style = useStyles();

	const projects = useStoreState(state => state.projects.allProjects);

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
		],
		[ProjectIcon],
	);

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
							<DataGrid items={projects} columns={columns} sortable selectionMode="single" subtleSelection onSelectionChange={onSelectionChange} getRowId={p => p.id}>
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

