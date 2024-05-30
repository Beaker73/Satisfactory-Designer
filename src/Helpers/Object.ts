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