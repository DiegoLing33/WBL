import dayjs from "dayjs";
import chalk from "chalk";

const timeString = () => dayjs().format("DD.MM.YYYY HH:mm:ss");
const logTitle = (name: string, color: any) => (color ?? chalk.yellow)(`[ ${name} ]`);
const __data = (...data: any[]) => data.map(String).join(" ");

export const logServer = (...data: any[]) =>
	console.log(chalk.gray(`[ ${timeString()} ]`) + logTitle('Server', chalk.yellow)
		+ ": " + __data(...data));
export const logClient = (...data: any[]) =>
	console.log(chalk.gray(`[ ${timeString()} ]`) + logTitle('Client', chalk.yellow)
		+ ": " + __data(...data));
export const logRenderer = (...data: any[]) =>
	console.log(chalk.gray(`[ ${timeString()} ]`) + logTitle('Renderer', chalk.yellow)
		+ ": " + __data(...data));
export const logLoader = (...data: any[]) =>
	console.log(chalk.gray(`[ ${timeString()} ]`) + logTitle('Loader', chalk.yellow)
		+ ": " + __data(...data));
export const logPlayer = (id: number, ...data: any[]) =>
	console.log(chalk.gray(`[ ${timeString()} ]`) + logTitle('Player:' + id, chalk.cyan)
		+ ": " + __data(...data));