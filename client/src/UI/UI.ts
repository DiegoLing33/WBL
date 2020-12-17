export class UIBar {
	protected $bar: HTMLElement;
	protected $text: HTMLElement;

	public max = 100;
	public current = 0;

	public constructor(barId: string) {
		this.$bar = document.getElementById(barId)!;
		this.$text = document.getElementById(barId + '-text')!;
	}

	public setCurrent(value: number) {
		const percent = Math.round((value / this.max) * 100) + "%";
		this.$bar.style['width'] = percent;
		this.$text.innerText = percent;
	}

	public setMax(value: number) {
		this.max = value;
		if (this.max < this.current) {
			this.current = this.max;
		}
		this.setCurrent(this.current);
	}

	public setValues(max: number, current: number) {
		this.max = max;
		this.setCurrent(current);
	}
}

export class UIPanel {
	protected $content: HTMLElement;

	public constructor(panelId: string) {
		this.$content = document.getElementById(panelId)!;
	}

	public display(visible: boolean) {
		if (visible) this.$content.style['display'] = "";
		else this.$content.style['display'] = "none";
	}

	public setContent(text: string) {
		this.$content.innerText = text;
	}
}

export class UIPlayerPanel extends UIPanel {

	public healthBar: UIBar;
	public energyBar: UIBar;
	protected playerName: UIPanel;

	public constructor(panelId: string) {
		super(panelId);
		this.playerName = new UIPanel(panelId + "-name");
		this.healthBar = new UIBar(panelId + "-hp");
		this.energyBar = new UIBar(panelId + "-ep");
	}

	public getHealthBar() {
		return this.healthBar;
	}

	public getEnergyBar() {
		return this.energyBar;
	}

	public getPlayerNamePanel() {
		return this.playerName;
	}
}

export default class UI {

	public playerPanel: UIPlayerPanel;

	public constructor() {
		this.playerPanel = new UIPlayerPanel("player-panel");
		this.playerPanel.display(false);
	}

}