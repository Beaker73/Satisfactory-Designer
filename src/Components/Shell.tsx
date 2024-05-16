import { makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { useEffect } from "react";

import { Canvas } from "@/Components/Canvas";
import { CommandBar } from "@/Components/CommandBar";
import { CommandPalette } from "@/Components/CommandPalette";
import { useStoreActions, useStoreState } from "@/Store";

export function Shell()
{
	const hasNoProjects = useStoreState(state => state.projects.hasNoProjects);
	const createDefaultProject = useStoreActions(store => store.projects.ensureDefault);
	useEffect(() => 
	{
		if (hasNoProjects)
			createDefaultProject();
	}, [createDefaultProject, hasNoProjects]);

	const styles = useStyles();

	return <div className={mergeClasses("main", styles.shell)}>
		zdfsfs
		<div className={styles.menu}>
			<CommandBar />
		</div>
		<div className={styles.panels}>
			<div className={styles.palette}>
				<CommandPalette />
			</div>
			<div className={styles.canvas}>
				<Canvas />
			</div>
			<div className={styles.properties}>
			</div>
		</div>
	</div>;
}

const useStyles = makeStyles({
	shell: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
		height: "100%",
		backgroundColor: tokens.colorNeutralBackground1,
	},
	menu: {
		flexGrow: 0,
	},
	panels: {
		flexGrow: 1,
		display: "flex",
		flexDirection: "row",
		height: "100%",
	},
	palette: {
		flexGrow: 0,
		...shorthands.borderRight(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke1),
	},
	canvas: {
		flexGrow: 1,
	},
	properties: {
		flexGrow: 0,
		...shorthands.borderLeft(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke1),
	},
});