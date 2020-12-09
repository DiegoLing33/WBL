export function fire(closure: any, ...args: any[]) {
	if (closure) closure(...args);
}

export function createFire(closure: any) {
	return (...args: any[]) => fire(closure, ...args);
}