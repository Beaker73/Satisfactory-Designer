export type RecursiveKey<T, S extends string = ""> = T extends object ? (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends readonly any[] ? RecursiveKey<T[number], `${S}${T[number]}.`> : (
		keyof T extends string ? `${S}${keyof T}` | RecursiveKey<T[keyof T], `${S}${keyof T}.`> : never
	)
) : never;
