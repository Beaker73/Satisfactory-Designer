import { hasValue } from "@/Helpers";
import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import type { Property } from "csstype";
import type { ForwardedRef } from "react";
import { forwardRef, type CSSProperties, type PropsWithChildren } from "react";

export interface StackProps {
	/** If set switches to a horizontal layout, instead of vertical */
	horizontal?: boolean;
	/** If set to true, adds a default gap. If set to a number the gap will be that wide. If not set no gap is used */
	gap?: number | boolean;
	/** If set wraps at the end to the next row/column */
	wrap?: boolean;
	/** vertical alignment */
	verticalAlign?: Property.AlignItems;

	/** class name to apply */
	className?: string;
	/** custom css styling to apply */
	style?: CSSProperties;
}

const StackComponent = forwardRef(
	function Stack(props: PropsWithChildren<StackProps>, ref: ForwardedRef<HTMLDivElement>) 
	{
		const styles = useStackStyles();

		const combinedStyles = mergeClasses(...[
			styles.root,
			props?.horizontal === true ? styles.horizontal : styles.vertical,
			props?.gap === true ? styles.defaultGap : undefined,
			props?.wrap === true ? styles.wrap : undefined,
			props.className,
		].filter(hasValue));

		let dynamicStyles: CSSProperties = {};
		if (typeof (props?.gap) === "number")
			dynamicStyles.gap = props.gap;
		if (props?.verticalAlign)
			dynamicStyles.alignItems = props.verticalAlign;
		if (props.style)
			dynamicStyles = { ...dynamicStyles, ...props.style };

		return <div className={combinedStyles} style={dynamicStyles} ref={ref}>
			{props.children}
		</div>;
	},
);


const useStackStyles = makeStyles({
	root: {
		display: "flex",
	},
	vertical: {
		flexDirection: "column",
		height: "100%",
	},
	horizontal: {
		flexDirection: "row",
		width: "100%",
	},
	defaultGap: {
		columnGap: tokens.spacingHorizontalM,
		rowGap: tokens.spacingVerticalM,
	},
	wrap: {
		flexWrap: "wrap",
	},
});

export interface StackItemProps {
	grow?: boolean;

	/** class name to apply */
	className?: string;
	/** custom css styling to apply */
	style?: CSSProperties;
}

export const StackItem = forwardRef(
	function StackItem(props: PropsWithChildren<StackItemProps>, ref: ForwardedRef<HTMLDivElement>) 
	{
		const styles = useStackItemStyles();

		const combinedStyles = mergeClasses(...[
			styles.root,
			props?.grow === true ? styles.grow : undefined,
			props.className,
		].filter(hasValue));

		return <div className={combinedStyles} ref={ref} style={props.style} >
			{props.children}
		</div>;
	},
);

const useStackItemStyles = makeStyles({
	root: {
		flexBasis: 0,
	},
	grow: {
		flexGrow: 1,
	},
});

// add StackItem as Stack.Item to the Stack component
type StackComponentFunc = typeof StackComponent & { Item: typeof StackItem };
export const Stack = StackComponent as StackComponentFunc;
Stack.Item = StackItem;
