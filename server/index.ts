import dotenv from "dotenv";
import GameServer from "./src/GameServer";

(() => {
	dotenv.config();
	const server = new GameServer(parseInt(process.env.SERVER_PORT ?? '3011'),
		process.env.SERVER_HOST ?? "localhost");

	server.start();
})();
