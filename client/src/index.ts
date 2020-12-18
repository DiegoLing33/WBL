/**
 * The entry point
 */
import {GameClient} from "./GameClient";
import UIThead from "./UIThead";
import LoginModal from "./UI/modals/LoginModal";
import SpritesLoader from "./loaders/SpritesLoader";

const debug = false;
let server = "server.ling.black";
let port = 3311;

if (debug) {
	server = 'localhost';
}

window.onload = () => {
	const gameClient = new GameClient("app", "mainCanvas", [
		"dragon", "player0", "fade"
	]);
	SpritesLoader.default.start().then(() => {
		const loginModal = UIThead.default.displayModal<LoginModal>('login');
		loginModal.getLoginButton().onClick(() => {
			const login = loginModal.getNameInput().getValue();
			if (login !== "") {
				gameClient.start(login, server, port);
			}
		});
	});
};