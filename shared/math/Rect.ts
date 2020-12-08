import {RectBounce, RectInterface} from "../interfaces/RectInterface";

export default class Rect implements RectInterface {

	public static zero = () => new Rect()
	public static size = (width: number, height: number) => new Rect(0, 0, width, height);
	public static position = (x: number, y: number) => new Rect(x, y, 0, 0);

	/**
	 * Returns the bounces
	 * @param rect
	 */
	public static getBounce(rect: RectInterface): RectBounce {
		return {
			x1: rect.x,
			y1: rect.y,
			x2: rect.x + rect.width,
			y2: rect.y - rect.height
		};
	}

	/**
	 * Returns the collision
	 * @param a
	 * @param b
	 */
	public static getIntersecting(a: RectInterface, b: RectInterface): RectBounce | false {
		let r1: any = Rect.getBounce(a);
		let r2: any = Rect.getBounce(b);

		[r1, r2] = [r1, r2].map(r => {
			return {x: [r.x1, r.x2].sort(), y: [r.y1, r.y2].sort()};
		});

		const noIntersect = r2.x[0] > r1.x[1] || r2.x[1] < r1.x[0] ||
			r2.y[0] > r1.y[1] || r2.y[1] < r1.y[0];

		return noIntersect ? false : {
			x1: Math.max(r1.x[0], r2.x[0]), // _[0] is the lesser,
			y1: Math.max(r1.y[0], r2.y[0]), // _[1] is the greater
			x2: Math.min(r1.x[1], r2.x[1]),
			y2: Math.min(r1.y[1], r2.y[1])
		};
	};

	public height: number;
	public width: number;
	public x: number;
	public y: number;

	constructor();
	constructor(x?: RectInterface);
	constructor(x?: number | RectInterface, y?: number, height?: number, width?: number);
	constructor(x?: number | RectInterface, y?: number, height?: number, width?: number) {
		if (x === undefined) {
			this.width = this.height = this.x = this.y = 0;
		}
		if (typeof x === "object") {
			this.x = x.x;
			this.y = x.y;
			this.width = x.width;
			this.height = x.height;
		} else {
			this.x = x ?? 0;
			this.y = y ?? 0;
			this.width = width ?? 0;
			this.height = height ?? 0;
		}
	}


	/**
	 * Returns intersections
	 * @param withRect
	 */
	getIntersecting(withRect: RectInterface): RectBounce | false {
		return Rect.getIntersecting(this, withRect);
	}

	getRect(): Readonly<RectInterface> {
		return {x: this.x, y: this.y, width: this.width, height: this.height};
	}
}