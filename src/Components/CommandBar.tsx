import type { InputProps } from "@fluentui/react-components";
import { Input, Menu, MenuItem, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Toolbar, ToolbarButton, makeStyles, shorthands, tokens, type MenuProps } from "@fluentui/react-components";
import { FolderAdd24Filled, FolderAdd24Regular, FolderOpen24Filled, FolderOpen24Regular, Settings24Filled, Settings24Regular, bundleIcon } from "@fluentui/react-icons";
import { Fragment, useCallback, useState } from "react";

import { Stack } from "@/Components/Stack";
import type { Project } from "@/Model/Project";
import { useStoreActions, useStoreState } from "@/Store";
import type { Theme } from "@/Store/Settings";
import { OpenProjectDialog } from "./OpenProjectDialog";

export function CommandBar() 
{
	const SettingsIcon = bundleIcon(Settings24Filled, Settings24Regular);

	const styles = useStyles();
	const hasRecent = false;

	const project = useStoreState(state => state.projects.activeProject);

	const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
	const openProjectDialog = useCallback(() => setIsProjectDialogOpen(true), []);
	const closeProjectDialog = useCallback(() => setIsProjectDialogOpen(false), []);
	const loadProject = useStoreActions(store => store.projects.loadProject);
	const openProject = useCallback((project: Project) => { closeProjectDialog(); loadProject({ project }); }, [closeProjectDialog, loadProject]);

	const changeProjectName = useStoreActions(store => store.projects.changeProjectName);
	const onProjectNameChange = useCallback<NonNullable<InputProps["onChange"]>>((_, data) => 
	{
		if (project)
			changeProjectName({ projectId: project.id, newName: data.value ?? "" });
	}, [changeProjectName, project]);

	return <Fragment>
		<OpenProjectDialog isOpen={isProjectDialogOpen} onDispose={closeProjectDialog} onProjectSelected={openProject} />
		<Stack.Item className={styles.appBar}>
			<Stack horizontal verticalAlign="center">
				<Stack.Item>
					<Toolbar>
						<Menu>
							<MenuTrigger>
								<ToolbarButton>File</ToolbarButton>
							</MenuTrigger>
							<MenuPopover>
								<MenuList>
									<MenuItemNewProject />
									<MenuItemOpenProject onClick={openProjectDialog} />
									{hasRecent && <Menu>
										<MenuTrigger>
											<MenuItem>Open Recent</MenuItem>
										</MenuTrigger>
										<MenuPopover>
											<MenuList>
												<MenuItem>Foobar 1</MenuItem>
												<MenuItem>Foobar 2</MenuItem>
											</MenuList>
										</MenuPopover>
									</Menu>}
								</MenuList>
							</MenuPopover>
						</Menu>
					</Toolbar>
				</Stack.Item>
				<Stack.Item grow>
					<Stack horizontal>
						<Stack.Item grow>&nbsp;</Stack.Item>
						<Stack.Item>
							<Input appearance="filled-lighter" style={{ textAlign: "center" }} value={project?.name} onChange={onProjectNameChange} />
						</Stack.Item>
						<Stack.Item grow>&nbsp;</Stack.Item>
					</Stack>
				</Stack.Item>
				<Stack.Item>
					<Toolbar>
						<Menu>
							<MenuTrigger>
								<ToolbarButton icon={<SettingsIcon />} />
							</MenuTrigger>
							<MenuPopover>
								<MenuList>
									<ThemeMenu />
								</MenuList>
							</MenuPopover>
						</Menu>
					</Toolbar>
				</Stack.Item>
			</Stack>
		</Stack.Item>
	</Fragment>;
}


const useStyles = makeStyles({
	appBar: {
		...shorthands.borderBottom(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke1),
	},
});


function MenuItemNewProject() 
{
	const FolderNewIcon = bundleIcon(FolderAdd24Filled, FolderAdd24Regular);
	const newProject = useStoreActions(store => store.projects.newProject);
	return <MenuItem icon={<FolderNewIcon />} onClick={() => newProject()}>New Project</MenuItem>;
}

function MenuItemOpenProject(props: { onClick: () => void }) 
{
	const { onClick } = props;
	const FolderOpenIcon = bundleIcon(FolderOpen24Filled, FolderOpen24Regular);
	return <MenuItem icon={<FolderOpenIcon />} onClick={onClick}>Open Project...</MenuItem>;
}


function ThemeMenu() 
{
	const theme = useStoreState(store => store.settings.theme);
	const setTheme = useStoreActions(store => store.settings.setTheme);
	const [checkedValues, setCheckedValues] = useState<Record<string, string[]>>({ theme: [theme ?? "dark"] });
	const onChange = useCallback<NonNullable<MenuProps["onCheckedValueChange"]>>(
		(_e, { name, checkedItems }) => 
		{
			setCheckedValues(s => ({ ...s, [name]: checkedItems }));
			if (name === "theme") 
			{
				const choice = checkedItems[0];
				if (choice)
					setTheme({ theme: choice as Theme });
			}
		}, [setTheme]);

	return <Menu>
		<MenuTrigger>
			<MenuItem>Theme</MenuItem>
		</MenuTrigger>
		<MenuPopover>
			<MenuList checkedValues={checkedValues} onCheckedValueChange={onChange}>
				<MenuItemRadio name="theme" value="light">Light</MenuItemRadio>
				<MenuItemRadio name="theme" value="dark">Dark</MenuItemRadio>
			</MenuList>
		</MenuPopover>
	</Menu>;

}
