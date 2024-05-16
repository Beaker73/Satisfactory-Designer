export function* pagePer<T>(count: number, translations: Generator<T> ): Generator<T[]>
{
	let page: T[] = [];

	for(const translation of translations) 
	{
		page.push(translation);
		if(page.length >= count) 
		{
			yield page;
			page = [];
		}
	}

	yield page;
}