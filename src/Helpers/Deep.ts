/**
 * Does a deep Object.freeze on the given object
 * @param thing The thing to freeze
 */
export function deepFreeze<T>(thing: T) 
{
	if (Array.isArray(thing))
		thing.forEach((item) => deepFreeze(item));
	else if (typeof thing === "object" && thing !== null)
		for (const key in thing)
			deepFreeze(thing[key]);

	return Object.freeze(thing);
}

/**
 * Does a deep clone of the given object
 * @param something The thing to clone
 * @returns A clone of the given object
 */
export function deepClone<T>(_something: T): T 
{
	throw new Error("Not implemented");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function match
export function deepMap(something: unknown, map: (item: any) => unknown): unknown
{
	if(!something)
		return something;

	console.debug("deepMap: ", { something });

	if(Array.isArray(something))
		return something.map(item => deepMap(item, map));
	else if(typeof something === "object" && something !== null)
		return Object.fromEntries(Object.entries(something).map(([key, item]) => [key, deepMap(item, map)]));
			
	return map(something);
}

/**
 * Does a deep merge of two objects into a new object
 * @param one 
 * @param other 
 */
export function deepMerge<T, U>(one: T, other: U): T | U | (T & U) 
{
	if (Array.isArray(one)) 
	{
		// if types do not match, new overwrites old
		if (!Array.isArray(other))
			return other;

		return one.concat(other) as T & U;
	}
	else if (isRecord(one)) 
	{
		// if types do not match, new overwrites old
		if (!isRecord(other))
			return other;

		const merged: Record<string, unknown> = {};
		const keys = Object.keys(one).concat(Object.keys(other));
		for (const key of keys) 
		{
			if(key in one && key in other)
				merged[key] = deepMerge(one[key], other[key]);
			else
				merged[key] = one[key] ?? other[key];
		}
		
		return merged as T & U;
	}

	return other ?? one as T | U;
}

function isRecord<T>(thing: T): thing is T & Record<string, unknown> 
{
	return typeof thing === "object" && thing !== null;
}