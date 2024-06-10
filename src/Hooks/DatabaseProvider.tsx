import { observer } from "mobx-react-lite";
import { useEffect, type PropsWithChildren } from "react";
import type { DatabaseProviderProps } from "./DatabaseContext";
import { clearDefaultDatabase, databaseAccessor, databaseContext, setDefaultDatabase } from "./DatabaseContext";


export const DatabaseProvider = observer(function DatabaseProvider(props: PropsWithChildren<DatabaseProviderProps>) 
{
	const { database } = props;

	useEffect(() => 
	{
		setDefaultDatabase(databaseAccessor(database));
		return () => clearDefaultDatabase();

	}, [database]);

	return <databaseContext.Provider value={database}>
		{props.children};
	</databaseContext.Provider>;
});
