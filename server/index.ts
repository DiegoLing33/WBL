import dotenv from "dotenv";
import GameServer from "./src/GameServer";

(() => {
	dotenv.config();
	const server = new GameServer(3311, "server.ling.black");

	server.start();
})();
