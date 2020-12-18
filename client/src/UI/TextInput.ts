import CoreUIElement from "./CoreUIElement";

export default class TextInput<InputDOMType extends HTMLInputElement = HTMLInputElement> extends CoreUIElement<InputDOMType> {

	constructor(id: string) {
		super(id);

	}

	/**
	 * Returns the value
	 */
	public getValue(): string {
		return this.getRaw().value;
	}

	/**
	 * Setts the value
	 * @param value
	 */
	public setValue(value: any) {
		this.getRaw().value = String(value);
		return this;
	}

	/**
	 * Sets the disabled state
	 * @param flag
	 */
	public setDisabled(flag: boolean) {
		this.getRaw().disabled = flag;
		return this;
	}

	/**
	 * Returns true, if element disabled
	 */
	public get isDisabled() {
		return this.getRaw().disabled;
	}
}