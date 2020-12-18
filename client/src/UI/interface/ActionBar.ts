import CoreUIElement, {__html, CoreUIHTML} from "../CoreUIElement";

export class ActionBarItem extends CoreUIElement<HTMLElement> {

	constructor() {
		super(__html('div'));
		this.getRaw().classList.add('action-player');
	}
}

export default class ActionBar extends CoreUIElement<HTMLElement> {

	protected actionItems: ActionBarItem[] = [];

	constructor(actionBarId: string, count: number) {
		super(actionBarId);
		this.getRaw().innerHTML = "";

		for (let i = 0; i < count; i++) {
			const newElement = new ActionBarItem();
			this.actionItems.push(newElement);
			this.addSubView(newElement);
		}
	}

}