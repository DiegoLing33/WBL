import { io, Socket } from 'socket.io-client';

export class GameClient {

	public $app!: HTMLElement;
	public $canvas!: HTMLCanvasElement;
	protected socket: Socket;

	constructor(appId: string, canvasId: string) {
		const app = document.getElementById(appId);
		const canvas = document.getElementById(canvasId) as HTMLCanvasElement | undefined;

		if (app && canvas) {
			this.$app = app;
			this.$canvas = canvas;
		}

		this.socket = io("http://localhost:3022");
		this.socket.on("ready", (id: number) => {
			console.log(id);
		})
	}

	start(){
		console.log('Yay!')
	}

}