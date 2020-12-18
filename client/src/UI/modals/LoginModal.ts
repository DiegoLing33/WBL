import Modal from "../components/Modal";
import Button from "../components/Button";
import TextInput from "../TextInput";

export default class LoginModal extends Modal {

	protected readonly loginButton: Button;
	protected readonly nameInput: TextInput;

	public constructor() {
		super("modal-login");
		this.loginButton = new Button("modal-login-button");
		this.nameInput = new TextInput("modal-login-name");
	}

	public getLoginButton(): Button {
		return this.loginButton;
	}

	public getNameInput(): TextInput {
		return this.nameInput;
	}

}