// based upon: https://codereview.stackexchange.com/questions/259330/racing-promises-and-consuming-them-in-the-order-of-their-resolution-time

/** Races all promises, one by one, yielding the results as they come available */
export function raceAll<T>(...promises: Promise<T>[])
{
	let racing = promises.map((promise, id) => Object.assign(
		new Promise<{id: number, result: T}>(resolve => promise.then(result => resolve({ id, result }))), { id },
	));

	return Object.freeze({
		async *[Symbol.asyncIterator]() 
		{
			while (racing.length) 
			{
				const resolved = await Promise.race(racing);
				yield resolved.result;
				racing = racing.filter(r => r.id !== resolved.id);
			}
		},
	});
}