import CoreUIElement from "../CoreUIElement";

export default class Button extends CoreUIElement<HTMLElement> {

	constructor(buttonId: string) {
		super(buttonId);
	}

	/**
	 * Sets on click event
	 * @param closure
	 */
	public onClick(closure: () => void) {
		this.getRaw().onclick = () => closure();
		return this;
	}
}