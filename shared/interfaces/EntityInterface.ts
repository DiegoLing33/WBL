import {RectInterface} from "./RectInterface";

export interface EntityInterface {
	id: number;
	collisions: number[];
	rect: RectInterface;
	maxHealth: number;
	maxEnergy: number;

	health: number;
	energy: number;
	name: string;
}