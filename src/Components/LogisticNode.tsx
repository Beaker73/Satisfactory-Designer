import type { Node } from "@/ComputeModel/Node";
import { Card, makeStyles, tokens } from "@fluentui/react-components";
import { observer } from "mobx-react-lite";
import { PortLink } from "./NodeCard";

export interface LogisticNodeProps {
	node: Node,
}

export const LogisticNode = observer(
	function LogisticNode(props: LogisticNodeProps) 
	{
		const { node } = props;

		const styles = useStyles();
		return <Card className={styles.root}>
			<div style={{ position: "absolute", left: -6, top: 10 }}>
				<PortLink node={node} port={node.inputPorts[0]} side="left" />
			</div>
			<div style={{ position: "absolute", left: 10, top: -6 }}>
				<PortLink node={node} port={node.outputPorts[0]} side="right" />
			</div>
			<div style={{ position: "absolute", left: 26, top: 10 }}>
				<PortLink node={node} port={node.outputPorts[0]} side="right" />
			</div>
			<div style={{ position: "absolute", left: 10, top: 26 }}>
				<PortLink node={node} port={node.outputPorts[0]} side="right" />
			</div>
			<div style={{ position: "absolute", left: 0, top: 0, width: 32, height: 32 }}>
				<svg viewBox="0 0 32 32" fill="none" stroke={tokens.colorNeutralStroke1} >
					<path d="M0 16 L32 16" />
					<path d="M0 16 C12 16 16 16 16 4" />
					<path d="M0 16 C12 16 16 16 16 28" />
					<path d="M32 16 l-8 -4 2 4 -2 4 8 -4" fill={tokens.colorNeutralStroke1} stroke="none" />
					<path d="M16 0 l-4 8 4 -2 4 2 -4 -8" fill={tokens.colorNeutralStroke1} stroke="none" />
					<path d="M16 32 l-4 -8 4 2 4 -2 -4 8" fill={tokens.colorNeutralStroke1} stroke="none" />
				</svg>
			</div>
		</Card>;
	},
);

const useStyles = makeStyles({
	root: {
		position: "relative",
		width: "32px",
		height: "32px",
		overflow: "visible",
	},
});