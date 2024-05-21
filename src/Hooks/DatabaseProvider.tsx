import type { Database as DatabaseData, Item } from "@/Plugins";
import { groupBy } from "lodash";
import { createContext, useContext, useMemo, type PropsWithChildren } from "react";

const databaseContext = createContext<DatabaseData | undefined>(undefined);

export interface DatabaseProviderProps
{
	database: DatabaseData,
}

export function DatabaseProvider(props: PropsWithChildren<DatabaseProviderProps>) 
{
	const { database } = props;

	return <databaseContext.Provider value={database}>
		{props.children};
	</databaseContext.Provider>;
}

export interface Database 
{
	items: {
		getByCategory(category: string): Item[],
		getByKey(itemKey: string): Item | undefined,
	}
}

/**
 * Returns the Satisfactory Database
 * @returns The Satisfactory Database
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useDatabase(): Database
{
	const data = useContext(databaseContext);
	if(!data)
		throw new Error("No database context");

	const database = useMemo<Database>(() => 
	{

		const itemsByCategory = groupBy(data.items, i => i.category);

		return {
			items: {
				getByCategory: category => itemsByCategory[category],
				getByKey: itemKey => data.items[itemKey],
			},
		};
	}, [data]);
	
	return database;
}