/**
 * The entry point
 */
import {GameClient} from "./GameClient";

window.onload = () => {
	const gameClient = new GameClient("app", "mainCanvas");
	gameClient.start();
};