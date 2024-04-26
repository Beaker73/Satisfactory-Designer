export * from "./ErrorHandling";


/**
 * Checks if the value is not null or undefined
 * @param value The value to check
 * @returns true if the value is not null or undefined; otherwise false
 */
export function hasValue<T>(value: T): value is NonNullable<T>
{
	return value !== undefined && value !== null;
}
