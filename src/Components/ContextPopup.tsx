import type { PopoverProps } from "@fluentui/react-components";
import { Popover, PopoverSurface, PopoverTrigger, tokens } from "@fluentui/react-components";
import type { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement } from "react";
import { isValidElement, useCallback, useState } from "react";

export interface ContextPopupProps {
	/** The content for the popup */
	content: ReactElement,
	/** The position for the menu, if not provided uses the mouse location */
	positioning?: PopoverProps["positioning"],
	/** Custom styling for the context menu */
	style?: CSSProperties,
}

export function ContextPopup(props: PropsWithChildren<ContextPopupProps>) 
{
	const { content } = props;

	const child = isValidElement(props.children) ? props.children : undefined;

	const [isOpen, setIsOpen] = useState(false);

	const onContextMenu = useCallback<MouseEventHandler<HTMLElement>>(
		(ev) => 
		{
			setIsOpen(true);
			ev.preventDefault();
		},
		[],
	);

	const onOpenChange = useCallback<NonNullable<PopoverProps["onOpenChange"]>>((_ev, data) => 
	{
		if (!data.open)
			setIsOpen(data.open);
	}, []);

	return <Popover open={isOpen} onOpenChange={onOpenChange} openOnContext={!props.positioning ? true : false} positioning={!props.positioning ? "below-start" : props.positioning}>
		<PopoverTrigger disableButtonEnhancement>
			<div onContextMenu={onContextMenu}>
				{child}
			</div>
		</PopoverTrigger>
		<PopoverSurface style={{ padding: tokens.spacingHorizontalXS, ...props.style }}>
			{content}
		</PopoverSurface>
	</Popover>;
}
