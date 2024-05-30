
/**
 * Generates an array of al record entries
 * @param record The record to get all entries from
 * @returns Array of all record entries
 */
export function objectEntries<K extends string, V>(record: Record<K,V>) 
{
	return Object.entries(record) as [K,V][];
}

export function objectFromEntries<K extends string, V>(items: [K,V][]) 
{
	return Object.fromEntries(items) as Record<K,V>;
}

/**
 * Gets all the values in the record
 * @param record The record to get all values from
 * @returns Array of all values in the record
 */
export function objectValues<R extends Record<K, V> | undefined, K extends string, V>(record: R): V[]
{
	if( record === undefined)
		return [];

	return Object.values(record);
}

type MapEntriesResult<R extends Record<K, VIn> | undefined, K extends string, VIn, VOut> =
	R extends undefined
		? Record<K, VOut> | undefined
		: Record<K, VOut>;

/**
 * Maps all entries of an object/record i.e. converting the values of the record
 * @param record The record to map
 * @param map The mapping function
 * @returns A new record with the same keys, but the values mapped to a new value
 */
export function objectMapEntries<
	R extends Record<K, VIn> | undefined, 
	K extends string, 
	VIn, 
	VOut
>(
	record: R, 
	map: (item: VIn, key: K) => VOut, 
)
	: MapEntriesResult<R, K, VIn, VOut>
{
	if(record === undefined)
		return undefined as MapEntriesResult<R, K, VIn, VOut>;

	return objectFromEntries<K, VOut>(
		objectEntries<K, VIn>(record)
			.map(([key, item]) => [key, map(item, key)]),
	);
}