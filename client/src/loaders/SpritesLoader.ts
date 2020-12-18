import {RectInterface} from "../../../shared/interfaces/RectInterface";
import Rect from "../../../shared/math/Rect";
import {logLoader} from "../../../server/src/logger";
import ImageIO from "../../../shared/utils/ImageIO";

export class Sprite {


	public rect: RectInterface;
	public image: HTMLImageElement;
	public damagedImage: any;
	public targetImage: any;

	public constructor(image: HTMLImageElement) {
		this.image = image;
		this.rect = new Rect(0, 0, image.naturalHeight, image.naturalWidth);
		this.damagedImage = ImageIO.addColorToImage(this.image, "#ff000");
		this.targetImage = ImageIO.addColorToImage(this.image, "#d6831d");
	}

}

export default class SpritesLoader {

	public loadedSprites: Record<string, Sprite> = {};
	public sprites: string[] = [];

	public static default: SpritesLoader;

	constructor(sprites: string[]) {
		this.sprites = sprites;
	}

	public start() {
		logLoader("Sprites loader started....");
		return new Promise<Boolean>(resolve => {
			const awaiter = setInterval(() => {
				if (Object.keys(this.loadedSprites).length === this.sprites.length) {
					clearInterval(awaiter);
					logLoader("Sprites loading completed!");
					resolve(true);
				}
			}, 100);

			this.sprites.forEach(source => {
				logLoader(`Sprite ${source} load...`);
				const image = new Image();
				image.onload = () => {
					logLoader(`Sprite ${source} load...`);
					this.loadedSprites[source] = new Sprite(image);
				}
				image.src = '/WBL/client/textures/' + source + '.png';
			});
		});

	}

}