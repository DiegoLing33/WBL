import Modal from "./UI/components/Modal";
import LoginModal from "./UI/modals/LoginModal";
import ActionBar from "./UI/interface/ActionBar";

export default class UIThead {

	/**
	 * Default instance of the UI thread class
	 */
	public static readonly default = new UIThead();

	/**
	 * Modals
	 * @protected
	 */
	protected modals: Record<string, Modal> = {
		"login": new LoginModal(),
	};

	protected actionBars = [
		new ActionBar('action-bar', 10),
	]

	protected constructor() {

	}

	/**
	 * Displays the modal
	 * @param modalName
	 */
	public displayModal<T extends Modal = Modal>(modalName: string): T {
		this.modals[modalName].setVisibility(true);
		return this.modals[modalName] as T;
	}

}