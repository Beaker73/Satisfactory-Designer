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

/**
 * Checks if the value is not null, undefined or false
 * @param value The value to check
 * @returns true if the value is not null, undefined or false; otherwise false
 */
export function hasValueNotFalse<T>(value: T | false): value is NonNullable<T>
{
	return hasValue(value) && value !== false;
}