/**
 * Generates an array of al record entries
 * @param record The record to get all entries from
 * @returns Array of all record entries
 */
export function objectEntries<K extends string, V>(record: Record<K,V>) 
{
	return Object.entries(record) as [K,V][];
}