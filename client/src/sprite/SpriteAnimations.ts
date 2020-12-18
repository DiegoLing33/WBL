/**
 * Анимация спрайта
 */
import AnimationObject from "../animation/AnimationObject";

export interface SpriteAnimation {
	length: number,
	row: number;
}

export type SpriteAnimationsData = { [name: string]: SpriteAnimation };
export type SpriteAnimations = { [name: string]: AnimationObject };
