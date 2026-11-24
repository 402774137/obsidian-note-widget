import { App, FuzzySuggestModal, PluginSettingTab, Setting, TextComponent, TFile } from "obsidian";
import type NoteWidgetPlugin from "./main";

export interface NoteWidgetSettings {
	/** 目标笔记的库内相对路径，例如 "Notes/今日.md" */
	notePath: string;
	/** 始终置顶 */
	alwaysOnTop: boolean;
	/** 贴边自动隐藏 */
	snapAutoHide: boolean;
	/** 窗口不透明度 0.3 - 1 */
	opacity: number;
	/** 内容缩放 0.6 - 2 */
	zoom: number;
	/** 窗口宽度 */
	width: number;
	/** 窗口高度 */
	height: number;
	/** 上次位置（完整可见时） */
	x: number | null;
	y: number | null;
	/** 上次关闭时小部件是否处于打开状态，用于重启后恢复 */
	widgetVisible: boolean;
}

export const DEFAULT_SETTINGS: NoteWidgetSettings = {
	notePath: "",
	alwaysOnTop: true,
	snapAutoHide: true,
	opacity: 1,
	zoom: 1,
	width: 360,
	height: 480,
	x: null,
	y: null,
	widgetVisible: false,
};

export class NoteSuggestModal extends FuzzySuggestModal<TFile> {
	constructor(app: App, private onPick: (file: TFile) => void) {
		super(app);
		this.setPlaceholder("搜索库中的笔记…");
	}

	getItems(): TFile[] {
		return this.app.vault.getMarkdownFiles();
	}

	getItemText(item: TFile): string {
		return item.path;
	}

	onChooseItem(item: TFile): void {
		this.onPick(item);
	}
}

export class NoteWidgetSettingTab extends PluginSettingTab {
	private statusEl: HTMLElement | null = null;
	private pathText: TextComponent | null = null;

	constructor(app: App, private plugin: NoteWidgetPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass("note-widget-settings");

		containerEl.createEl("h2", { text: "笔记小部件" });
		containerEl.createEl("p", {
			cls: "setting-item-description",
			text: "小部件是一个独立于 Obsidian 主窗口的无边框桌面窗口（仅桌面端可用）。拖动标题栏可移动窗口，拖动窗口边缘可改变大小。",
		});

		new Setting(containerEl)
			.setName("目标笔记")
			.setDesc("填写库内相对路径（例如 Notes/今日待办.md），或点击「选择」从库中挑选。")
			.addText((text) => {
				this.pathText = text;
				text.setPlaceholder("Notes/今日待办.md")
					.setValue(this.plugin.settings.notePath)
					.onChange(async (value) => {
						this.plugin.settings.notePath = value.trim();
						await this.plugin.saveSettings();
						void this.plugin.widget.handleTargetChanged();
						this.refreshStatus();
					});
			})
			.addButton((button) => {
				button.setButtonText("选择").onClick(() => {
					new NoteSuggestModal(this.app, async (file) => {
						this.plugin.settings.notePath = file.path;
						await this.plugin.saveSettings();
						this.pathText?.setValue(file.path);
						void this.plugin.widget.handleTargetChanged();
						this.refreshStatus();
					}).open();
				});
			});

		this.statusEl = containerEl.createDiv({ cls: "note-widget-status" });
		this.refreshStatus();

		new Setting(containerEl)
			.setName("始终置顶")
			.setDesc("让小部件始终显示在其他窗口之上，也可以在窗口右上角的面板按钮里随时切换。")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.alwaysOnTop).onChange(async (value) => {
					this.plugin.settings.alwaysOnTop = value;
					this.plugin.applySettings();
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("贴边自动隐藏")
			.setDesc("把窗口拖到屏幕任意一条边后自动收起，只在边缘留一个小把手；鼠标移入时滑出，移出后收回。")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.snapAutoHide).onChange(async (value) => {
					this.plugin.settings.snapAutoHide = value;
					this.plugin.applySettings();
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("窗口不透明度")
			.setDesc("方便在小部件下继续操作其他应用。")
			.addSlider((slider) =>
				slider
					.setLimits(0.4, 1, 0.05)
					.setValue(this.plugin.settings.opacity)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.opacity = value;
						this.plugin.applySettings();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("内容缩放")
			.addSlider((slider) =>
				slider
					.setLimits(0.7, 1.6, 0.05)
					.setValue(this.plugin.settings.zoom)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.zoom = value;
						this.plugin.applySettings();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("窗口宽度")
			.addSlider((slider) =>
				slider
					.setLimits(240, 800, 10)
					.setValue(this.plugin.settings.width)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.width = value;
						this.plugin.applySettings();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("窗口高度")
			.addSlider((slider) =>
				slider
					.setLimits(200, 900, 10)
					.setValue(this.plugin.settings.height)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.height = value;
						this.plugin.applySettings();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("显示 / 关闭小部件")
			.setDesc("也可以用左侧边栏的面板图标，或在命令面板执行「打开/关闭笔记小部件」。")
			.addButton((button) =>
				button.setButtonText("打开").onClick(async () => {
					await this.plugin.widget.open();
				})
			)
			.addButton((button) =>
				button.setButtonText("关闭").onClick(async () => {
					await this.plugin.widget.close();
				})
			);
	}

	private refreshStatus(): void {
		if (!this.statusEl) return;
		this.statusEl.removeClass("is-warning");
		const file = this.plugin.getTargetFile();
		if (file) {
			this.statusEl.setText(`已关联：${file.path}`);
			return;
		}
		this.statusEl.addClass("is-warning");
		this.statusEl.setText(
			this.plugin.settings.notePath ? "未在库中找到这条笔记，请检查路径（需要包含 .md）。" : "尚未选择目标笔记。"
		);
	}
}
