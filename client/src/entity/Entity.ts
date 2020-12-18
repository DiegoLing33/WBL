import {RectInterface} from "../../../shared/interfaces/RectInterface";
import Rect from "../../../shared/math/Rect";
import {EntityInterface} from "../../../shared/interfaces/EntityInterface";
import SpritesLoader, {Sprite} from "../loaders/SpritesLoader";
import {SpriteAnimations} from "../sprite/SpriteAnimations";
import AnimationObject from "../animation/AnimationObject";

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

	protected currentAnimation: AnimationObject | null = null;
	protected animations: SpriteAnimations = {
		idle: new AnimationObject('idle', 2, 0, {width: 128, height: 128}),
		move: new AnimationObject('move', 4, 1, {width: 128, height: 128}),
		spawn: new AnimationObject('spawn', 6, 0, {width: 128, height: 128}),
		despawn: new AnimationObject('despawn', 6, 1, {width: 128, height: 128}),
	};

	public sprite?: Sprite;
	public isHurting: boolean = false;

	public constructor(id: number) {
		this.id = id;
		this.target = undefined;

		this.idle();
	}


	/**
	 * Устанавливает анимации
	 * @param animations
	 */
	public setAnimations(animations: SpriteAnimations){
		this.animations = animations;
	}

	/**
	 * Возвращает анимации
	 */
	public getAnimations(): SpriteAnimations{
		return this.animations;
	}

	/**
	 * Возвращает текущую анимацию
	 */
	public getCurrentAnimation(): AnimationObject | null{
		return this.currentAnimation;
	}


	/**
	 * Устанавливает анимацию
	 * @param name
	 * @param speed
	 * @param count
	 * @param onEnd
	 */
	public setAnimation(name: string, speed: number, count?: number, onEnd?: () => void) {
		if (this.isReady()) {
			if (this.currentAnimation && this.currentAnimation.name === name) return;
			const a = this.animations[name];
			if (a) {
				this.currentAnimation = a;
				this.currentAnimation.setSpeed(speed);
				this.currentAnimation.setCount(count || 0, onEnd);
			}
		}
	}

	animate(animation: string, speed: number, count?: number, onEnd?: () => void){
		this.setAnimation(animation, speed, count, onEnd);
	}

	isReady(){
		return this;
	}

	move() {

	}

	idle() {
		this.animate("idle", 1000);
	}

	/**
	 * Spawns the entity
	 * @param rect
	 */
	public spawn(rect: RectInterface) {
		this.rect = rect;
		this.sprite = SpritesLoader.default.loadedSprites['fade'];
		this.animate("spawn", 20, 1, () => {
			this.sprite = SpritesLoader.default.loadedSprites['player0'];
			this.idle();
		});
	}

	public despawn(handler: () => void){
		this.sprite = SpritesLoader.default.loadedSprites['fade'];
		this.animate("despawn", 20, 1, () => {
			this.sprite = undefined;
			handler();
		});
	}

	public moveTo(position: RectInterface) {
		this.rect.x = position.x;
		this.rect.y = position.y;
	}


}