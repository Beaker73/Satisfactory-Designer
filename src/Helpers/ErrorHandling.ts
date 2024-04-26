/**
 * Tries to extract an error message from any object
 * @param object The object to extract the error message from.
 * @param defaultMessage [optional] The default message to return if no error message could be found.
 * @returns The error message that was found, or when none found, the default error message. If no default given returns an empty string;
 */
export function errorMessage(object: unknown, defaultMessage?: string): string 
{
	// if error class then directly take message from error
	if (object instanceof Error)
		return object.message;

	// detected if object is already string, return it as-is.
	if (typeof object === "string")
		return object;

	if (typeof object === "object" && object !== null)
	{
		// if object contains an errorMessage field, return it.
		if ("errorMessage" in object && typeof object.errorMessage === "string")
			return object.errorMessage;
		// if object contains toString, use that to return an errorMessage
		if ("toString" in object)
			return object.toString();
	}

	// all exausted, return the default message (if given)
	return defaultMessage ?? "";
}
