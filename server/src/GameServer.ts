import ServerPlayer from "./ServerPlayer";
import * as socketIO from "socket.io";
import express, {Express} from "express";
import {createServer, Server as HTTPServer} from "http";
import {logServer} from "./logger";
import {getRandomInt} from "../../shared/math/Math";
import Rect from "../../shared/math/Rect";


export default class GameServer {

	public readonly port: number;
	public readonly host: string;

	protected readonly players: ServerPlayer[];
	protected lastPlayerId: number;
	protected app: Express;
	protected http: HTTPServer;
	protected io: socketIO.Server;


	constructor(port: number, host: string) {
		this.port = port;
		this.host = host;

		this.players = [];
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
				this.createPlayer(socket);
			});
		});
	}

	public createPlayer(socket: socketIO.Socket) {
		const playerId = ++this.lastPlayerId;
		const player = new ServerPlayer(playerId, socket,
			Rect.position(getRandomInt(10, 800), getRandomInt(10, 800)));

		this.players.push(player);
		this.broadcastPlayersList();

		player.onDisconnected = () => () => {
			this.broadcastPlayersList();
		};

		player.onCollision = (self, target) => {
			this.broadcastPlayersList();
		};

		player.onCollisionRequest = selfPlayer => {
			const collisions: number[] = [];

			this.forEachPlayer(withPlayer => {
				if (selfPlayer.rect.getIntersecting(withPlayer.rect) !== false) {
					collisions.push(withPlayer.getId());
				}
			}, [selfPlayer.getId()]);

			return collisions;
		};
	}

	/**
	 * Returns only connected players
	 */
	public getPlayersList(ignore: number[] = []) {
		return this.players.filter(value => !value.disconnected && !ignore.includes(value.getId()));
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
			player.getSocket().emit(event, ...args);
		});
	}

	public broadcastPlayersList() {
		this.broadcast("playersList", this.getPlayersList().map(value => value.pack()));
	}

}