import type { PopoverProps } from "@fluentui/react-components";
import { Popover, PopoverSurface, PopoverTrigger } from "@fluentui/react-components";
import type { MouseEventHandler, PropsWithChildren, ReactElement } from "react";
import { isValidElement, useCallback, useState } from "react";

export interface ContextPopupProps {
	/** The content for the popup */
	content: ReactElement;
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

	return <Popover open={isOpen} onOpenChange={onOpenChange} positioning="after-bottom">
		<PopoverTrigger disableButtonEnhancement>
			<div onContextMenu={onContextMenu}>
				{child}
			</div>
		</PopoverTrigger>
		<PopoverSurface>
			{content}
		</PopoverSurface>
	</Popover>;
}
