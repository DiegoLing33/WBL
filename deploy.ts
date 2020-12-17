import {createDeployClient} from "@ling.black/deploy/dist";

require("dotenv").config();

( async ()=>{


	const deploy = await createDeployClient({
		host: 'server.ling.black',
		port: 22,
		password: process.env.SERVER_PASS || "",
		user: 'root',
	});

	await deploy.nodeJSDeployExpressApp({
		localPath:  "./dist",
		remotePath: "/home/diego/game-server",
		port: 3311
	});

})();