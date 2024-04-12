import { makeStyles, tokens } from "@fluentui/react-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import coal from "@/Assets/coal.png";
import miner from "@/Assets/portable-miner.png";

import { Node } from "./Node";
import { Stack } from "./Stack";

export function Canvas() {
	const styles = useStyles();

	return <DndProvider backend={HTML5Backend}>
		<Stack horizontal wrap className={styles.root} tokens={{ childrenGap: 8 }}>
			<Node name="Coal" description="Normal" imagePath={coal} />
			<Node name="Miner" description="120 p/m" imagePath={miner} onConfigClicked={() => { }} />
		</Stack>
	</DndProvider>;
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
		//backgroundImage: `url(${background})`,
		minWidth: "100%",
		minHeight: "100%",
	},
});