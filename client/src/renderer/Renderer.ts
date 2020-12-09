import {RectInterface} from "../../../shared/interfaces/RectInterface";
import {logRenderer} from "../../../server/src/logger";
import Rect from "../../../shared/math/Rect";
import {GameClient} from "../GameClient";
import Entity from "../entity/Entity";

export interface RenderingTextOptions {
	color?: string;
	size?: number;
}

export default class Renderer {

	public readonly $canvas: HTMLCanvasElement;
	public readonly $context: CanvasRenderingContext2D;

	public develop: boolean = true;
	public lastTimeUpdate: number = 0;
	public FPS: number = 0;
	public tempFPS: number = 0;

	public size: RectInterface;
	public client: GameClient;

	public displayBoundingRects = false;

	public constructor($canvas: HTMLCanvasElement, appSize: RectInterface, client: GameClient) {
		this.client = client;

		this.size = appSize;
		this.$canvas = $canvas;

		this.$context = this.$canvas.getContext('2d')!;

		logRenderer(`Render size: ${this.size.width} x ${this.size.height}`);
		this.setFontSize(14);
	}

	public clear() {
		this.drawRect(new Rect(0, 0, this.size.width, this.size.height), "#000");
	}

	public setFontSize(size: number) {
		this.$context.font = size + 'px Neo'
	}

	public drawText(text: string, rect: RectInterface, props?: RenderingTextOptions) {
		this.$context.save();
		let color = "#ffffff";
		let size = 14;
		if (props) {
			if (props.color) color = props.color;
			if (props.size) size = props.size;
		}
		this.setFontSize(size);
		this.$context.fillStyle = color;
		this.$context.fillText(text, rect.x, rect.y + size);
		this.$context.restore();
	}


	public drawRect(rect: RectInterface, color?: string) {
		this.$context.save();
		this.$context.fillStyle = color ?? "#ffffff";
		this.$context.fillRect(rect.x, rect.y, rect.width, rect.height);
		this.$context.restore();
	}

	public drawBorder(rect: RectInterface, color: string, lineWidth: number = 1) {
		this.$context.save();
		this.$context.lineWidth = lineWidth;
		this.$context.strokeStyle = color ?? "#ffffff";
		this.$context.strokeRect(rect.x, rect.y, rect.width, rect.height);
		this.$context.restore();
	}

	public drawImage(image: any, sourceRect: RectInterface, dstRect: RectInterface) {
		this.$context.save();
		this.$context.drawImage(
			image,
			sourceRect.x,
			sourceRect.y,
			sourceRect.width,
			sourceRect.height,
			dstRect.x,
			dstRect.y,
			dstRect.width,
			dstRect.height
		)
		this.$context.restore();
	}

	public renderEntityName(entity: Entity) {
		this.$context.save();
		this.$context.globalAlpha = 0.8;
		this.drawText(
			entity.name,
			Rect.position(entity.rect.width / 2, 50),
			{color: "#ffffff"}
		);
		this.$context.restore();
	}

	public renderEntityHealthBar(entity: Entity) {
		this.$context.save();
		this.$context.globalAlpha = 0.6;
		const barsWidth = 60;

		const hpBarHeight = 10;
		const epBarHeight = 4;

		const hpBarPosition = -25;
		const barsBorder = 2;

		const offsetX = (entity.rect.width - barsWidth) / 2;

		const hpWidth = (entity.health / entity.maxHealth) * barsWidth;
		const epWidth = (entity.energy / entity.maxEnergy) * barsWidth;

		this.drawRect(new Rect(offsetX, hpBarPosition, hpBarHeight, barsWidth), "#ffc1ac");
		this.drawRect(new Rect(offsetX, hpBarPosition, hpBarHeight, hpWidth), "#ff3c00");
		this.drawRect(new Rect(offsetX, hpBarPosition + (hpBarHeight - epBarHeight), epBarHeight, barsWidth), "#8fc9e0");
		this.drawRect(new Rect(offsetX, hpBarPosition + (hpBarHeight - epBarHeight), epBarHeight, epWidth), "#00c4ff");
		this.drawBorder(new Rect(offsetX, hpBarPosition - (barsBorder / 2),
			(hpBarHeight + epBarHeight) - barsBorder, barsWidth), "#4e4e4e", barsBorder);

		this.$context.restore();
	}

	public renderEntities(lastTimeUpdate: number) {
		Object.values(this.client.entities).forEach(entity => {
			this.$context.save();
			this.$context.translate(entity.rect.x, entity.rect.y);
			this.$context.textAlign = 'center';


			if (entity.sprite) {
				this.$context.save();
				this.$context.translate( 20, 20);
				const rad = (entity.rect.angle / 180) * Math.PI
				this.$context.rotate(rad);
				this.$context.translate( -20, -20);

				if (this.displayBoundingRects) {
					this.drawRect(new Rect(0, 0, entity.rect.height, entity.rect.width));
				}

				if (entity.id === this.client.player.target) {
					this.drawImage(entity.sprite.targetImage,
						entity.sprite.rect, new Rect(0, 0, entity.rect.height, entity.rect.width));
				} else {
					this.drawImage(entity.sprite.image,
						entity.sprite.rect, new Rect(0, 0, entity.rect.height, entity.rect.width));
				}

				if (entity.isHurting) {
					this.drawImage(entity.sprite.damagedImage,
						entity.sprite.rect, new Rect(0, 0, entity.rect.height, entity.rect.width));
				}

				this.$context.restore();
			}


			this.renderEntityName(entity);
			this.renderEntityHealthBar(entity);
			this.$context.restore();
		});
	}

	public renderDevelopInformation(lastTimeUpdate: number) {
		this.drawText('FPS: ' + this.FPS, Rect.position(20, 30));
		this.drawText(`Mouse: X: ${this.client.mouse.position.x}, Y: ${this.client.mouse.position.y}`,
			Rect.position(20, 48));
		this.drawText(`Player: X: ${this.client.player.rect.x}, Y: ${this.client.player.rect.y}`,
			Rect.position(20, 66));
		this.drawText(`Target: ${this.client.player.target}`,
			Rect.position(20, 82));
		this.tempFPS++;
		this.drawText(`A: ${this.client.player.rect.angle}`,
			Rect.position(20, 98));
		this.drawText(`C: ${JSON.stringify(this.client.player.collisions)}`,
			Rect.position(20, 114));
		this.tempFPS++;
		if (lastTimeUpdate - this.lastTimeUpdate >= 1000) {
			this.lastTimeUpdate = lastTimeUpdate;
			this.FPS = this.tempFPS;
			this.tempFPS = 0;
		}
	}

	/**
	 * Renders method
	 */
	public render(lastTimeUpdate: number) {
		this.clear();
		this.$context.save();
		if (this.develop) this.renderDevelopInformation(lastTimeUpdate);
		this.renderEntities(lastTimeUpdate);
		this.$context.restore();
	}


}