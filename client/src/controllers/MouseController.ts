import {RectInterface} from "../../../shared/interfaces/RectInterface";
import Rect from "../../../shared/math/Rect";

export default class MouseController {

	public position: RectInterface = Rect.zero();
	public onClick?: (e: MouseEvent, mouse: MouseController) => void;

	public constructor() {
		window.onmousemove = (ev: MouseEvent) => {
			this.position = new Rect(ev.pageX, ev.pageY - 40, 2, 2);
		};
		window.onclick = (ev: MouseEvent) => {
			if (this.onClick) this.onClick(ev, this);
		};
	}

}