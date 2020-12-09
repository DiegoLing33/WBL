import ServerClient from "./ServerClient";

export default class ConsoleClient {

	public $console: HTMLElement;
	public $consoleText: HTMLTextAreaElement;
	public $consoleInput: HTMLInputElement;
	protected server: ServerClient;
	public visible: boolean = false;

	constructor(server: ServerClient) {
		this.server = server;

		this.$console = document.getElementById("console")!;
		this.$consoleText = document.getElementById("console-log") as HTMLTextAreaElement;
		this.$consoleInput = document.getElementById("console-input") as HTMLInputElement;

		this.$consoleText.readOnly = true;
		this.$consoleInput.onkeydown = ev => {
			if (ev.key === 'Enter') {
				const command = this.$consoleInput.value;
				this.server.sendCommand(command);
				this.me(command);
				this.$consoleInput.value = '';
			}
		};

		this.server.onConsoleMessage = message => this.log(message);
	}

	public log(...data: any[]) {
		this.$consoleText.value += ('> ' + data.map(String).join(" ") + "\n");
	}

	public me(...data: any[]) {
		this.$consoleText.value += ('>> ' + data.map(String).join(" ") + "\n");
	}

	public display(visible: boolean) {
		this.visible = visible;
		if (visible) {
			this.$consoleInput.value = '';
			this.$console.style['display'] = 'flex';
			setTimeout(()=>{
				this.$consoleInput.focus();
			}, 200);
		} else {
			this.$consoleInput.value = '';
			this.$console.style['display'] = 'none';
		}
	}

}