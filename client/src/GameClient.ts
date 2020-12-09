import {io, Socket} from 'socket.io-client';
import Renderer from "./renderer/Renderer";
import Rect from "../../shared/math/Rect";
import {logClient} from "../../server/src/logger";
import {EntityInterface} from "../../shared/interfaces/EntityInterface";
import Entity from "./entity/Entity";
import MouseController from "./controllers/MouseController";
import KeyboardController from "./controllers/KeyboardController";
import Player from "./entity/Player";
import ServerClient from "./server/ServerClient";
import ConsoleClient from "./server/ConsoleClient";
import SpritesLoader from "./loaders/SpritesLoader";

export class GameClient {

	public $app!: HTMLElement;
	public $canvas!: HTMLCanvasElement;
	protected socket!: Socket;

	public height: number = 0;
	public width: number = 0;

	public id: number = -1;
	public started = false;

	public renderer!: Renderer;
	public server!: ServerClient;
	public entities: Record<number, Entity> = {};
	public console!: ConsoleClient;

	public loop: any = null;
	public lastTimeUpdate: number = new Date().getTime();
	public player!: Player;
	public target?: Entity;

	public loader: SpritesLoader;

	// Controllers
	public mouse: MouseController;
	public keyboard: KeyboardController;

	constructor(appId: string, canvasId: string, textures: string[]) {
		this.height = window.innerHeight;
		this.width = window.innerWidth;

		const app = document.getElementById(appId);
		const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		if (app && canvas) {
			this.$app = app;
			this.$canvas = canvas;
		}

		// Mouse
		this.mouse = new MouseController();
		this.mouse.onClick = this.onMouseClick.bind(this);

		// Keyboard
		this.keyboard = new KeyboardController();
		this.keyboard.onKeyDown = this.onKeyDown.bind(this);
		this.keyboard.onKeyUp = this.onKeyUp.bind(this);

		this.loader = new SpritesLoader(textures);
	}

	checkKeyboard(){
		if (!this.console.visible) {
			if (this.keyboard.isPressed('w')) {
				this.server.sendMove('up');
			}
			if (this.keyboard.isPressed('s')) {
				this.server.sendMove('down');
			}
			if (this.keyboard.isPressed('a')) {
				this.server.sendRotate('left');
			}
			if (this.keyboard.isPressed('d')) {
				this.server.sendRotate('right');
			}
		}
	}

	startGameLoop() {
		this.loop = setInterval(() => {
			this.renderer.render(this.lastTimeUpdate);
			this.checkKeyboard();
			this.lastTimeUpdate = new Date().getTime();
		}, 1000 / 30);
	}

	/**
	 * Returns true, if entity is exists
	 * @param id
	 */
	hasEntity(id: number) {
		return !!this.entities[id];
	}

	getEntityById(id: number) {
		return this.entities[id];
	}

	start() {
		logClient("Client started");
		this.socket = io("http://localhost:3022");
		this.server = new ServerClient(this.socket);
		this.console = new ConsoleClient(this.server);
		this.renderer = new Renderer(this.$canvas, Rect.size(this.width, this.height), this);
		this.started = true;

		this.server.onMove = (selfId, selfRect, collisions) => {
			if (this.hasEntity(selfId)) {
				const entity = this.entities[selfId];
				entity.rect.x = selfRect.x;
				entity.rect.y = selfRect.y;
				entity.collisions = collisions;
			}
		};

		this.server.onEntityHealth = (selfId, max, current) => {
			if (this.hasEntity(selfId)) {
				const entity = this.entities[selfId];
				entity.maxHealth = max;
				entity.health = current;
			}
		};

		this.server.onEntityName = (selfId, name) => {
			if (this.hasEntity(selfId)) {
				this.entities[selfId].name = name;
			}
		};

		this.server.onEntityTarget = (selfId, targetId) => {
			if (this.hasEntity(selfId)) this.getEntityById(selfId).target = targetId;
		};
		this.server.onEntityRotate = (self, angle) => {
			if (this.hasEntity(self)) this.getEntityById(self).rect.angle = angle;
		};

		this.server.start();

		this.socket.on("ready", (id: number) => {
			this.onConnected(id);
		})
		this.socket.on("playersList", (players: EntityInterface[]) => {
			this.onPlayers(players);
		});
	}

	isStarted() {
		return this.started;
	}

	onConnected(id: number) {
		this.id = id;
		logClient("Got id:", id);
		this.startGameLoop();
	}

	onMouseClick(e: MouseEvent) {
		this.server.sendMouseClick(this.mouse.position);
	}

	onKeyDown(e: KeyboardEvent) {
		if (!this.isStarted()) return;


	}

	onKeyUp(e: KeyboardEvent) {
		if (!this.isStarted()) return;

		if (e.key === '`') {
			this.console.display(!this.console.visible);
		}
	}

	onPlayers(players: EntityInterface[]) {
		players.forEach(player => {
			if (!this.entities.hasOwnProperty(player.id)) {
				const entity = new Entity(player.id);
				this.entities[player.id] = entity;

				entity.sprite = this.loader.loadedSprites['dragon'];
				entity.name = player.name;
				entity.energy = player.energy;
				entity.health = player.health;
				entity.maxHealth = player.maxHealth;
				entity.maxEnergy = player.maxEnergy;
				entity.collisions = player.collisions;
				entity.rect.angle = 90;
				entity.spawn(player.rect);
				if (player.id === this.id) {
					this.player = entity;
					this.console.log('Your id is', this.id);
					this.console.log(JSON.stringify(player, null, 2));
				}
			}
		});
	}

}