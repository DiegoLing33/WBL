import * as socketIO from "socket.io";
import {PlayerInterface} from "../../shared/interfaces/PlayerInterface";
import Rect from "../../shared/math/Rect";
import {RectInterface} from "../../shared/interfaces/RectInterface";
import {logPlayer} from "./logger";

export default class ServerPlayer {
	protected readonly id: number;
	protected readonly socket: socketIO.Socket;
	public disconnected: boolean = false;

	// Entity
	public rect: Rect;
	public speed: number = 1;
	public collisions: number[] = [];

	public health: number = 0;
	public energy: number = 0;

	public next: Rect = Rect.position(0, 0);

	// Events
	public onDisconnected?: (player: ServerPlayer) => void;
	public onMove?: (player: ServerPlayer) => void;
	public onCollision?: (player: ServerPlayer, target: ServerPlayer) => void;

	// Closures
	public onCollisionRequest?: (player: ServerPlayer) => number[];

	/**
	 * Constructor
	 *
	 * @param id
	 * @param socket
	 * @param rect
	 */
	constructor(id: number, socket: socketIO.Socket, rect: RectInterface) {
		this.id = id;
		this.socket = socket;
		this.rect = new Rect(rect.x, rect.y, 40, 40);
		this.next = Rect.position(rect.x, rect.y);

		this.health = 100;
		this.energy = 80;

		logPlayer(this.getId(), "Ready to go");
		this.sendReady();

		socket.on("disconnect", () => {
			this.disconnect();
		});


		let interval: any = null;
		let path = this.rect.height;
		socket.on("move", direction => {
			path = this.rect.height;
			if (interval) clearInterval(interval);
			interval = setInterval(() => {
				if (direction === 'up') {
					this.next = Rect.position(this.next.x, this.next.y - this.speed);
					this.collisions = this.onCollisionRequest ? this.onCollisionRequest(this) : [];
					if (this.collisions.length > 0) {
						clearInterval(interval);
						return;
					}
					this.rect.y -= this.speed;
				}
				if (direction === 'down') {
					this.next = Rect.position(this.next.x, this.next.y + this.speed);
					this.collisions = this.onCollisionRequest ? this.onCollisionRequest(this) : [];
					if (this.collisions.length > 0) {
						clearInterval(interval);
						return;
					}
					this.rect.y += this.speed;
				}
				if (direction === 'right') {
					this.next = Rect.position(this.next.x + this.speed, this.next.y);
					this.collisions = this.onCollisionRequest ? this.onCollisionRequest(this) : [];
					if (this.collisions.length > 0) {
						clearInterval(interval);
						return;
					}
					this.rect.x += this.speed;
				}
				if (direction === 'left') {
					this.next = Rect.position(this.next.x - this.speed, this.next.y);
					this.collisions = this.onCollisionRequest ? this.onCollisionRequest(this) : [];
					if (this.collisions.length > 0) {
						clearInterval(interval);
						return;
					}
					this.rect.x -= this.speed;
				}
				path -= this.speed;
				if (path <= 0) clearInterval(interval);
				if (this.onMove) this.onMove(this);
			}, 10);
		});
	}

	/**
	 * Returns the player id
	 */
	public getId(): number {
		return this.id;
	}

	public getSocket(): socketIO.Socket {
		return this.socket;
	}

	public disconnect() {
		this.disconnected = true;
		logPlayer(this.getId(), "Disconnected");
		if (this.onDisconnected) this.onDisconnected(this);
	}


	public collideWith(player: ServerPlayer) {
		logPlayer(this.id, "Collision with", player.getId());
		if (this.onCollision) this.onCollision(this, player);
	}

	/**
	 * Returns the player pack to send it on clients
	 */
	public pack(): PlayerInterface {
		return {
			id: this.id,
			collisions: this.collisions,
			health: this.health,
			energy: this.energy,
			rect: this.rect.getRect(),
		}
	}

	/**
	 * Sends message to the client
	 * @param event
	 * @param args
	 */
	public send(event: string, ...args: any[]) {
		this.getSocket().emit(event, ...args);
	}

	public sendReady() {
		this.send("ready", this.getId());
	}
}