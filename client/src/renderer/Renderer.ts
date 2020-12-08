export default class Renderer{

	public readonly $canvas: HTMLCanvasElement;
	public readonly $context: CanvasRenderingContext2D;

	public constructor($canvas: HTMLCanvasElement) {
		this.$canvas = $canvas;
		this.$context = this.$canvas.getContext('2d')!;

		console.log()
	}


}