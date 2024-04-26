import { useCallback } from "react";

/**
 * Combine multiple event callbacks into a single function that calls them in order
 */
export function useMergedCallbacks<Event>(
	...callbacks: (((ev: Event) => void) | undefined)[]
) 
{
	return useCallback(
		(ev: Event) => 
		{
			for (const callback of callbacks)
				callback?.(ev);
		},
		[callbacks],
	);
}