export const NOT_VISIBLE_STYLE = 'none';
export const VISIBLE_STYLE = 'flex';

export class CoreUIHTML {
	public readonly html: string;

	constructor(html: string) {
		this.html = html;
	}
}

export function __html(h: string){
	return new CoreUIHTML(h);
}

export default class CoreUIElement<T extends HTMLElement> {

	private readonly raw: T;

	public readonly id?: string;

	/**
	 * Constructor
	 * @param id
	 */
	public constructor(id: string);
	public constructor(dom: CoreUIHTML);
	public constructor(id: string | CoreUIHTML) {
		if (typeof id === "string") {
			this.id = id;
			this.raw = document.getElementById(id) as T;
		} else {
			this.raw = document.createElement(id.html) as T;
		}
	}

	public getRaw(): T {
		return this.raw;
	}

	public getText() {
		return this.raw.innerText;
	}

	public setText(text: string) {
		this.raw.innerText = text;
		return this;
	}

	public addStyle(styles: Record<string, any>) {
		Object.keys(styles).forEach(key => {
			this.raw.style[key as any] = styles[key];
		});
		return this;
	}

	/**
	 * Sets the visibility
	 * @param flag
	 */
	public setVisibility(flag?: boolean) {
		return this.addStyle({display: flag ? VISIBLE_STYLE : NOT_VISIBLE_STYLE});
	}

	/**
	 * Returns true, if element is setVisibility
	 */
	public get isVisible() {
		return this.raw.style['display'] && this.raw.style['display'] !== NOT_VISIBLE_STYLE;
	}

	public addSubView(view: CoreUIElement<HTMLElement>){
		this.getRaw().appendChild(view.getRaw());
		return this;
	}
}