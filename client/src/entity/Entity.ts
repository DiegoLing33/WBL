import {RectInterface} from "../../../shared/interfaces/RectInterface";
import Rect from "../../../shared/math/Rect";
import {EntityInterface} from "../../../shared/interfaces/EntityInterface";
import {Sprite} from "../loaders/SpritesLoader";

export default class Entity implements EntityInterface {

	public id: number;
	public rect: RectInterface = Rect.zero();
	public name: string = "";
	public collisions: number[] = [];
	public energy: number = 0;
	public health: number = 0;
	public maxEnergy: number = 0;
	public maxHealth: number = 0;

	public target?: number;
	public attackers: number[] = [];

	public sprite?: Sprite;

	public isHurting: boolean = false;

	public constructor(id: number) {
		this.id = id;
		this.target = undefined;
	}

	/**
	 * Spawns the entity
	 * @param rect
	 */
	public spawn(rect: RectInterface) {
		this.rect = rect;
	}

	public moveTo(position: RectInterface) {
		this.rect.x = position.x;
		this.rect.y = position.y;
	}


}