import dayjs from "dayjs";
import chalk from "chalk";

const timeString = () => dayjs().format("DD.MM.YYYY HH:mm:ss");
const logTitle = (name: string, color: any) => (color ?? chalk.yellow)(`[ ${name} ]`);
const __data = (...data: any[]) => data.map(String).join(" ");

export const logServer = (...data: any[]) =>
	console.log(chalk.gray(`[ ${timeString()} ]`) + logTitle('Server', chalk.yellow)
		+ ": " + __data(...data));
export const logPlayer = (id: number, ...data: any[]) =>
	console.log(chalk.gray(`[ ${timeString()} ]`) + logTitle('Player:' + id, chalk.cyan)
		+ ": " + __data(...data));