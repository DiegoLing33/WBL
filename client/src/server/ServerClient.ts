import {Socket} from "socket.io-client";
import {DirectionString} from "../../../shared/types/Direction";
import {RectInterface} from "../../../shared/interfaces/RectInterface";

export default class ServerClient {
	private socket: Socket;

	public onMove!: (id: number, rect: RectInterface, collisions: number[]) => void;
	public onConsoleMessage!: (message: string) => void;
	public onEntityHealth!: (id: number, max: number, current: number) => void;
	public onEntityName!: (id: number, name: string) => void;
	public onEntityTarget!: (id: number, target?: number) => void;
	public onEntityRotate!: (id: number, angle: number) => void;

	public constructor(socket: Socket) {
		this.socket = socket;
	}

	public start() {
		this.socket.on("moveEntity", this.onMove.bind(this));
		this.socket.on("consoleMessage", this.onConsoleMessage.bind(this));
		this.socket.on("entityHealth", this.onEntityHealth.bind(this));
		this.socket.on("entityName", this.onEntityName.bind(this));
		this.socket.on("entityTarget", this.onEntityTarget.bind(this));
		this.socket.on("entityRotate", this.onEntityRotate.bind(this));
	}

	public sendMove(direction: DirectionString) {
		this.socket.emit('move', direction);
	}

	public sendRotate(direction: DirectionString) {
		this.socket.emit('rotate', direction);
	}

	public sendCommand(command: string) {
		this.socket.emit("command", command);
	}

	public sendMouseClick(rect: RectInterface) {
		this.socket.emit("click", rect);
	}
}