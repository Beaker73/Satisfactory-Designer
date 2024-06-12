import type { Position } from "@/Model/Position";
import { Tooltip, makeStyles, tokens } from "@fluentui/react-components";
import { observer } from "mobx-react-lite";

export interface ConnectorProps {
	source: Position,
	target: Position,
	value?: string | number,
	tooltip?: string,
	// sourceError?: string,
	// targetError?: string,
}

export const Connector = observer((props: ConnectorProps) =>
{
	const { source: { x: x1, y: y1 }, target: { x: x2, y: y2 }, value, tooltip } = props;
	const height = Math.abs(y2 - y1);
	const styles = useStyles();


	if(x1 > x2) 
	{
		const width = x1 - x2;

		return <div className={styles.root} style={{ left: x2-32, top: y1-4, width: width+64, height: height+8 }}>
			<svg viewBox={`0 0 ${width+64} ${height+8}`}>
				<path d={`M ${width+32} 4 c 32 0 32 ${height/2} -32 ${height/2} l ${-(width-64)} 0 c -64 0 -64 ${height/2} -32 ${height/2}`} fill="none" stroke={tokens.colorNeutralStroke1} />
				<path d={`M 32 ${height+4} l -8 -4 l 2 4 l -2 4 l 8 -4`} stroke="none" fill={tokens.colorNeutralStroke1} />
			</svg>
			<div className={styles.value}>
				{tooltip && <Tooltip content={tooltip} relationship="description">
					<span className={styles.text}>{value}</span>
				</Tooltip>}
				{!tooltip && <span>{value}</span>}
			</div>
		</div>;
	}


	const width = x2 - x1;

	return <div className={styles.root} style={{ left: x1, top: y1, width: width, height: height + 4 }}>
		<svg viewBox={`0 0 ${width} ${height+8}`}>
			<path d={`M 0 0 C ${width/2} 0 ${width/2} ${height} ${width} ${height}`} fill="none" stroke={tokens.colorNeutralStroke1} />
			<path d={`M ${width} ${height} l -8 -4 l 2 4 l -2 4 l 8 -4`} stroke="none" fill={tokens.colorNeutralStroke1} />
		</svg>
		<div className={styles.value}>
			{tooltip && <Tooltip content={tooltip} relationship="description">
				<span className={styles.text}>{value}</span>
			</Tooltip>}
			{!tooltip && <span>{value}</span>}
		</div>
	</div>;
});

const useStyles = makeStyles({
	root: {
		position: "absolute",
		pointerEvents: "none",
	},
	value: {
		paddingLeft: "6px", 
		paddingRight: "6px", 
		borderRadius: "4px", 
		position: "absolute", 
		left: "50%", top: "50%", 
		transform: "translate(-50%, -50%)",
		fontSize: tokens.fontSizeBase100, 
		color: tokens.colorNeutralForeground3, 
		backgroundColor: tokens.colorNeutralForegroundInverted, 
		pointerEvents: "all",
		boxShadow: tokens.shadow2,
	},
	text: {
		userSelect: "none",
	},
});