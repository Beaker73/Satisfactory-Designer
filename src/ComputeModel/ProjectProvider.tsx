import { observer } from "mobx-react-lite";
import type { PropsWithChildren } from "react";
import type { ProjectProviderProps } from "./ProjectContext";
import { projectContext } from "./ProjectContext";


export const ProjectProvider = observer((props: PropsWithChildren<ProjectProviderProps>) => 
{
	const Provider = projectContext.Provider;

	return <Provider value={props.project}>
		{props.children}
	</Provider>;
});
