/**
 * The entry point
 */
import {GameClient} from "./GameClient";

window.onload = () => {
	const gameClient = new GameClient("app", "mainCanvas", [
		"dragon"
	]);
	gameClient.loader.start().then(() => {
		gameClient.start();
	});
};