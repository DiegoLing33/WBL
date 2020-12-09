export default class KeyboardController {
	public onKeyUp?: (ev: KeyboardEvent) => void;
	public onKeyDown?: (ev: KeyboardEvent) => void;

	public pressed: Record<string, boolean> = {};

	public constructor() {
		window.onkeydown = (ev: KeyboardEvent) => {
			this.pressed[ev.key] = true;
			if (this.onKeyDown) this.onKeyDown(ev);
		};
		window.onkeyup = (ev: KeyboardEvent) => {
			this.pressed[ev.key] = false;
			if (this.onKeyUp) this.onKeyUp(ev);
		};
	}

	public isPressed(key: string) {
		return this.pressed[key] ?? false;
	}

}