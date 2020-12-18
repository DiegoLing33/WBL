import * as socketIO from "socket.io";
import {EntityInterface} from "../../shared/interfaces/EntityInterface";
import Rect from "../../shared/math/Rect";
import {RectInterface} from "../../shared/interfaces/RectInterface";
import {logPlayer} from "./logger";
import {DirectionString} from "../../shared/types/Direction";

export default class ServerPlayer {
	protected readonly id: number;
	protected socket: socketIO.Socket;
	public disconnected: boolean = false;

	// Entity
	public rect: Rect;
	public speed: number = 1;
	public rotationSpeed: number = 3;
	public collisions: number[] = [];

	public health: number = 0;
	public maxHealth: number = 0;
	public energy: number = 0;
	public maxEnergy: number = 0;
	public name: string = "";

	public target?: number;
	public targetBy: number[] = [];

	public next: Rect = Rect.position(0, 0);

	// Events
	public onDisconnected!: (player: ServerPlayer) => void;
	public onCommand!: (message: string) => void;
	public onMove?: (player: ServerPlayer) => void;
	public onHealth?: (player: ServerPlayer) => void;
	public onName?: (player: ServerPlayer) => void;
	public onRotate!: (angle?: number) => void;
	public onTarget!: (targetId?: number) => void;
	public onTargetBy!: (attackers: number[]) => void;
	public onCollision!: (player: ServerPlayer, target: ServerPlayer) => void;

	// Closures
	public onCollisionRequest!: (player: ServerPlayer) => number[];
	public onClick!: (rect: RectInterface) => void;

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
		this.rect = new Rect(rect.x, rect.y, 80, 80, 0);
		this.next = new Rect(rect.x, rect.y, 80, 80, 0);

		this.health = 100;
		this.energy = 80;

		this.maxHealth = 100;
		this.maxEnergy = 80;

		this.name = 'Player' + this.id;
		logPlayer(this.getId(), "Ready to go");
	}

	public setUpSocket(socket: socketIO.Socket) {
		this.socket = socket;
		this.disconnected = false;

		socket.on("disconnect", () => {
			this.disconnect();
		});

		socket.on("command", (message: string) => this.onCommand(message));

		let rPath = 0;
		let rInterval: any = null;
		socket.on("rotate", (direction: DirectionString) => {
			rPath = 9;
			if (rInterval) clearInterval(rInterval);
			rInterval = setInterval(() => {
				if (rPath > 0) {
					if (direction === 'right') {
						this.setAngle(this.rect.angle + this.rotationSpeed);
					}
					if (direction === 'left') {
						this.setAngle(this.rect.angle - this.rotationSpeed);
					}
					rPath -= this.rotationSpeed;
				} else {
					clearInterval(rInterval);
				}
			}, 10);
		});

		let interval: any = null;
		let path = 0;
		socket.on("move", direction => {
			path = this.rect.height;
			if (interval) clearInterval(interval);
			interval = setInterval(() => {
				if (direction === 'up') {
					const rad = (this.rect.angle / 180) * Math.PI;
					this.next.setPosition(
						this.rect.x + this.speed * Math.sin(rad),
						this.rect.y - this.speed * Math.cos(rad)
					);
					this.collisions = this.onCollisionRequest(this);
					if (this.collisions.length > 0) {
						clearInterval(interval);
						return;
					}

					this.rect.y -= this.speed * Math.cos(rad);
					this.rect.x += this.speed * Math.sin(rad);
				}
				if (direction === 'down') {
					const rad = (this.rect.angle / 180) * Math.PI;
					this.next.setPosition(
						this.rect.x - this.speed * Math.sin(rad),
						this.rect.y + this.speed * Math.cos(rad)
					);
					this.collisions = this.onCollisionRequest(this);
					if (this.collisions.length > 0) {
						clearInterval(interval);
						return;
					}

					this.rect.y += this.speed * Math.cos(rad);
					this.rect.x -= this.speed * Math.sin(rad);
				}
				path -= this.speed;
				if (path <= 0) clearInterval(interval);
				if (this.onMove) this.onMove(this);
			}, 10);
		});

		this.getSocket().on("click", clickPosition => {
			this.onClick(clickPosition);
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

	public setHealth(value: number) {
		this.health = value;
		if (this.onHealth) this.onHealth(this);
	}

	public setName(value: string) {
		this.name = value;
		if (this.onName) this.onName(this);
	}

	public setTarget(entityId?: number) {
		this.target = entityId;
		this.onTarget(entityId);
	}

	public setAngle(angle: number) {
		const fixedAngle = angle % 360;
		this.rect.setAngle(fixedAngle);
		this.onRotate(fixedAngle);
	}

	public setTargetBy(entityId: number) {
		this.targetBy.push(entityId);
		this.onTargetBy(this.targetBy);
	}

	public setFreeTargetBy(entityId: number) {
		this.targetBy.splice(this.targetBy.indexOf(entityId), 1);
		this.onTargetBy(this.targetBy);
	}

	public disconnect() {
		this.disconnected = true;
		logPlayer(this.getId(), "Disconnected");
		if (this.onDisconnected) this.onDisconnected(this);
	}


	public collideWith(player: ServerPlayer) {
		logPlayer(this.id, "Collision with", player.getId());
		this.onCollision(this, player);
	}

	/**
	 * Returns the player pack to send it on clients
	 */
	public pack(): EntityInterface {
		return {
			id: this.id,
			collisions: this.collisions,
			health: this.health,
			energy: this.energy,
			rect: this.rect.getRect(),
			name: this.name,
			maxEnergy: this.maxEnergy,
			maxHealth: this.maxHealth,
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
		this.send("ready", this.getId(), this.pack());
	}
}