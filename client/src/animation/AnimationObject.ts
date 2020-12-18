/**
 * Анимация
 */
export default class AnimationObject {

	public readonly name: string;
	public readonly length: number;
	public readonly row: number;
	public readonly size: { width: number, height: number };
	public currentFrame: AnimationFrame = new AnimationFrame(0, 0, 0);

	protected count: number = 0;
	protected speed: number = 100;

	protected lastTime: number = 0;
	public onEndCallback?: () => void;

	/**
	 * Конструктор
	 * @param name
	 * @param length
	 * @param row
	 * @param size
	 */
	public constructor(name: string, length: number, row: number, size: { width: number, height: number }) {
		this.name   = name;
		this.length = length;
		this.row    = row;
		this.size   = size;
		this.reset();
	}

	/**
	 * Устанавливает кол-во повторений анимации
	 * @param count
	 * @param onEnd
	 */
	public setCount(count: number, onEnd?: () => void) {
		this.count         = count;
		this.onEndCallback = onEnd;
	}

	/**
	 * Устанавливает скорость анимации
	 * @param speed
	 */
	setSpeed(speed: number) {
		this.speed = speed;
	}

	/**
	 * Совершает тик анимации
	 */
	public tick() {
		let i = this.currentFrame.index;
		i     = (i < this.length - 1) ? i + 1 : 0;
		if (this.count > 0) {
			if (i === 0) {
				this.count -= 1;
				if (this.count === 0) {
					this.currentFrame.index = 0;
					if(this.onEndCallback) this.onEndCallback();
					return;
				}
			}
		}

		this.currentFrame.x     = this.size.width * i;
		this.currentFrame.y     = this.size.height * this.row;
		this.currentFrame.index = i;
	}

	/**
	 * Возвращает true, если пора соврешать движение
	 * @param time
	 */
	public isTimeToAnimate(time: number): boolean {
		return (time - this.lastTime) > this.speed;
	}

	/**
	 * Обновляет состояния анимации
	 * @param time
	 */
	public update(time: number): boolean {
		if (this.lastTime === 0 && this.name.substr(0, 3) === "atk") {
			this.lastTime = time;
		}
		if (this.isTimeToAnimate(time)) {
			this.lastTime = time;
			this.tick();
			return true;
		}
		return false;
	}

	/**
	 * Сбрасывает анимацию
	 */
	public reset() {
		this.lastTime     = 0;
		this.currentFrame = {index: 0, x: 0, y: this.row * this.size.height};
	}
}

/**
 * Кадр анимации
 */
export class AnimationFrame {
	public index: number;
	public x: number;
	public y: number;

	/**
	 * Конструктор
	 * @param index
	 * @param x
	 * @param y
	 */
	constructor(index: number, x: number, y: number) {
		this.index = index;
		this.x     = x;
		this.y     = y;
	}
}