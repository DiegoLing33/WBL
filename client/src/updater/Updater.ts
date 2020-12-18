import {GameClient} from "../GameClient";
import Entity from "../entity/Entity";

export default class Updater {

	protected readonly client: GameClient;

	public constructor(client: GameClient) {
		this.client = client;
	}

	public update(time: number) {
		this.updateEntities(time);
	}

	public updateEntities(time: number) {
		Object.values(this.client.entities)
			.forEach(entity => this.updateEntity(entity, time));
	}

	public updateEntity(entity: Entity, time: number) {
		if(entity.getCurrentAnimation()){
			entity.getCurrentAnimation()?.update(time);
		}
	}

}