import { ErrorMessage } from "@/Components/ErrorMessage";
import { Loading } from "@/Components/Loading";
import type { Database } from "@/Data/Satisfactory/Database";
import { loadDatabase } from "@/Data/Satisfactory/Database";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

const databaseContext = createContext<Database | undefined>(undefined);

export function DatabaseProvider(props: PropsWithChildren) 
{
	const [database, setDatabase] = useState<Database | undefined>();
	const [error, setError] = useState<undefined | unknown>();

	useEffect(() => 
	{
		loadDatabase()
			.then(database => setDatabase(database))
			.catch(x => setError(x));
	}, [setDatabase]);

	if (database)
		return <databaseContext.Provider value={database}>
			{props.children};
		</databaseContext.Provider>;
	if (error)
		return <ErrorMessage message="Error while loading Satisfactory database" error={error} />;

	return <Loading message="Loading Satisfactory database" />;
}

/**
 * Returns the Satisfactory Database
 * @returns The Satisfactory Database
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useDatabase(): Database
{
	const database = useContext(databaseContext);
	if(!database)
		throw new Error("No database context");
	
	return database;
}