export default class ImageIO{

	public static addColorToImage(image: any, color: string){
		const cnv = document.createElement("canvas") as HTMLCanvasElement;
		cnv.height = image.naturalHeight;
		cnv.width = image.naturalWidth;
		const ctx = cnv.getContext("2d")!;
		ctx.fillStyle = color;
		ctx.fillRect(0, 0,
			image.naturalWidth,
			image.naturalHeight
		);
		ctx.globalCompositeOperation = "destination-in";
		ctx.drawImage(image,
			0,
			0,
			image.naturalWidth,
			image.naturalHeight
		);
		return cnv;
	}

}