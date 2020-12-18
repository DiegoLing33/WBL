import ServerPlayer from "./ServerPlayer";
import * as socketIO from "socket.io";
import express, {Express} from "express";
import {createServer, Server as HTTPServer} from "http";
import {logServer} from "./logger";
import {getRandomInt} from "../../shared/math/Math";
import Rect from "../../shared/math/Rect";
import {RectInterface} from "../../shared/interfaces/RectInterface";
import vm from "vm";
import {Logger} from "@ling.black/log";


export default class GameServer {

	public readonly port: number;
	public readonly host: string;

	protected readonly players: Record<number, ServerPlayer>;
	protected lastPlayerId: number;
	protected app: Express;
	protected http: HTTPServer;
	protected io: socketIO.Server;

	protected database: Record<string, ServerPlayer> = {};

	constructor(port: number, host: string) {
		this.port = port;
		this.host = host;

		this.players = {};
		this.lastPlayerId = 0;

		this.app = express();
		this.http = createServer(this.app);
		this.io = require("socket.io")(this.http, {
			cors: {
				origin: '*',
			}
		});

		this.app.get("/", (req, res) => {
			res.send("ok").status(200);
		});
	}

	public start(): void {
		this.http.listen(this.port, this.host, () => {
			logServer(`Server started ${this.host}:${this.port}`);

			this.io.on("connection", (socket: socketIO.Socket) => {
				Logger.log('New connection ++');
				socket.onAny((e, login) => {
					if (e === "login") {
						if (!this.database.hasOwnProperty(login)) {
							this.database[login] = this.createPlayer(socket);
						}
						const player = this.database[login];
						player.setName(login);
						player.setUpSocket(socket);
						player.sendReady();
						this.broadcastPlayersList();
					}
				});
			});
		});
	}

	public createPlayer(socket: socketIO.Socket) {
		const playerId = ++this.lastPlayerId;
		const player = new ServerPlayer(playerId, socket,
			Rect.position(getRandomInt(10, 800), getRandomInt(10, 800)));

		this.players[playerId] = player;

		player.onCommand = ((message: string) => {
			const players = this.players;
			message = message.replace(/@([0-9]+)/g, "id($1)");

			(function() {
				let results: string;
				try {
					const ctx = {
						id: (id: number) => {
							return players[id];
						},
						players
					};
					vm.createContext(ctx);
					vm.runInContext(message, ctx);
					results = String(ctx);
				} catch (e) {
					results = String(e);
				}
				player.send("consoleMessage", results);

			})();
		});

		player.onDisconnected = () => {
			this.broadcast("entityDisconnect", player.getId());
		};

		player.onCollision = (self, target) => {
			this.broadcastCollision(self.getId(), target.getId());
		};

		player.onMove = (self) => {
			this.broadcastPlayerMove(self.getId(), self.rect, self.collisions);
		};

		player.onHealth = self => {
			this.broadcastEntityHealth(self.getId(), self.maxHealth, self.health);
		};

		player.onName = () => {
			this.broadcastEntityName(player.getId(), player.name);
		};

		player.onTarget = targetId => {
			this.broadcastTarget(player.getId(), targetId);
			if (player.target && this.hasEntity(player.target)) {
				this.getEntityById(player.target).setFreeTargetBy(player.getId());
			}
		};
		player.onRotate = angle => {
			this.broadcastEntityRotation(player.getId(), angle);
		};

		player.onTargetBy = attackers => {
			console.log(attackers);
		};

		player.onClick = rect => {
			const collisions: number[] = [];

			this.forEachPlayer(withPlayer => {
				if (Rect.getIntersecting(rect, withPlayer.rect) !== false) {
					collisions.push(withPlayer.getId());
				}
			});

			if (collisions.length > 0) {
				player.setTarget(collisions[0]);
			} else {
				player.setTarget(undefined);
			}
		};

		player.onCollisionRequest = selfPlayer => {
			const collisions: number[] = [];

			this.forEachPlayer(withPlayer => {
				if (selfPlayer.next.getIntersecting(withPlayer.rect) !== false) {
					collisions.push(withPlayer.getId());
				}
			}, [selfPlayer.getId()]);
			return collisions;
		};

		return player;
	}

	public hasEntity(id: number) {
		return !!this.players[id];
	}

	public getEntityById(id: number) {
		return this.players[id];
	}

	/**
	 * Returns only connected players
	 */
	public getPlayersList(ignore: number[] = []) {
		return Object.values(this.players).filter(value => !value.disconnected && !ignore.includes(value.getId()));
	}

	/**
	 * Loops through the players
	 * @param closure
	 * @param ignore
	 */
	public forEachPlayer(closure: (player: ServerPlayer, index: number) => void, ignore: number[] = []) {
		this.getPlayersList(ignore).forEach(closure);
	}

	/**
	 * Returns the last generated id
	 */
	public getLastPlayerId() {
		return this.lastPlayerId;
	}

	/**
	 * Sends the broadcast
	 * @param event
	 * @param args
	 */
	public broadcast(event: string, ...args: any[]) {
		this.forEachPlayer(player => {
			player.send(event, ...args);
		});
	}

	public broadcastPlayerMove(id: number, rect: RectInterface, collisions: number[]) {
		this.broadcast("moveEntity", id, rect, collisions);
	}

	public broadcastEntityHealth(id: number, maxHealth: number, health: number) {
		this.broadcast("entityHealth", id, maxHealth, health);
	}

	public broadcastEntityName(id: number, name: string) {
		this.broadcast("entityName", id, name);
	}

	public broadcastEntityRotation(id: number, angle?: number) {
		this.broadcast("entityRotate", id, angle);
	}

	public broadcastPlayersList() {
		this.broadcast("playersList", this.getPlayersList().map(value => value.pack()));
	}

	public broadcastTarget(id: number, targetId?: number) {
		this.broadcast("entityTarget", id, targetId);
	}

	public broadcastCollision(id: number, targetId?: number) {
		this.broadcast("entityCollision", id, targetId);
	}

}