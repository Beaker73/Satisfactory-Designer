import { useEffect } from "react";

export const enum ShortcutModifiers {
	None = 0,
	Shift = 1,
	Ctrl = 2,
	Alt = 4,
	Meta = 8,
}

export function useShortcutKey(onShortcutPressed: () => void, key: string, modifiers?: ShortcutModifiers) 
{
	const mod = modifiers ?? ShortcutModifiers.None;
	console.debug("useShortcutKey", { key, mod });

	useEffect(
		() => 
		{
			console.debug("useShortcutKey/useEffect", { key, mod });

			document.addEventListener("keydown", onKeyDown);
			return document.removeEventListener("keydown", onKeyDown);

			function onKeyDown(this: Document, event: KeyboardEvent) 
			{
				console.debug("useShortcutKey/useEffect/onKeyDown", { key, mod, event });

				if (event.key != key)
					return;
				if (event.repeat)
					return;
				if ((mod & ShortcutModifiers.Shift) != 0 && !event.shiftKey)
					return;
				if ((mod & ShortcutModifiers.Ctrl) != 0 && !event.ctrlKey)
					return;
				if ((mod & ShortcutModifiers.Alt) != 0 && !event.altKey)
					return;
				if ((mod & ShortcutModifiers.Meta) != 0 && !event.metaKey)
					return;

				event.preventDefault();
				onShortcutPressed();
			}
		},
		[key, mod, onShortcutPressed],
	);
}