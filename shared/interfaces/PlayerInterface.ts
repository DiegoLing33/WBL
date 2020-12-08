import {RectInterface} from "./RectInterface";

export interface PlayerInterface {
	id: number;
	collisions: number[];
	rect: RectInterface;
	health: number;
	energy: number;
}