import type { BuildingKey } from "@/Model/Building";
import type { Guid } from "@/Model/Identifiers";

export interface BuildingNodeProps {
	nodeId: Guid,
	buildingKey: BuildingKey,
}

export function BuildingNode(props: BuildingNodeProps) 
{

}