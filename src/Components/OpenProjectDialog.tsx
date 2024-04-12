import type { Project } from "@/Model/Project";
import { useStoreState } from "@/Store";
import type { TableColumnDefinition } from "@fluentui/react-components";
import { Button, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, TableCellLayout, createTableColumn, makeStyles } from "@fluentui/react-components";
import { DocumentFlowchart24Filled, DocumentFlowchart24Regular, bundleIcon } from "@fluentui/react-icons";
import { compareAsc, formatDate } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { Stack } from "./Stack";

export function useOpenProject() 
{
	const ProjectIcon = bundleIcon(DocumentFlowchart24Filled, DocumentFlowchart24Regular);

	const [isOpen, setIsOpen] = useState(false);

	const openProject = useCallback(
		() => setIsOpen(true),
		[],
	);

	const closeDialog = useCallback(
		() => setIsOpen(false),
		[],
	);

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

	const OpenProjectDialog = useCallback(() => 
	{
		return <>
			{isOpen && <Dialog open={isOpen}>
				<DialogSurface>
					<DialogBody>
						<DialogTitle>Open Project</DialogTitle>
						<DialogContent>
							<Stack className={style.projects}>
								<DataGrid items={projects} columns={columns} sortable selectionMode="single" getRowId={p => p.id}>
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
							<Button appearance="primary">Open</Button>
						</DialogActions>
					</DialogBody>
				</DialogSurface>
			</Dialog>}
		</>;
	}, [closeDialog, columns, isOpen, projects, style.projects]);

	return {
		openProject,
		isOpen,
		OpenProjectDialog,
	};
}

const useStyles = makeStyles({
	projects: {
		minHeight: "min(50vh, 300px)",
		overflowY: "auto",
	},
});