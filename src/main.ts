import { Plugin, TFile } from "obsidian";
import { DEFAULT_SETTINGS, NoteWidgetSettings, NoteWidgetSettingTab } from "./settings";
import { WidgetWindow } from "./widget";

export default class NoteWidgetPlugin extends Plugin {
	settings!: NoteWidgetSettings;
	widget!: WidgetWindow;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.widget = new WidgetWindow(this);

		this.addRibbonIcon("panel-top", "打开/关闭笔记小部件", () => void this.widget.toggle());

		this.addCommand({
			id: "toggle-note-widget",
			name: "打开/关闭笔记小部件",
			callback: () => void this.widget.toggle(),
		});
		this.addCommand({
			id: "refresh-note-widget",
			name: "刷新笔记小部件",
			callback: () => void this.widget.render(),
		});

		this.addSettingTab(new NoteWidgetSettingTab(this.app, this));

		// 目标笔记内容变化时自动刷新小部件
		this.registerEvent(
			this.app.vault.on("modify", (file) => {
				if (file instanceof TFile && file.path === this.getTargetFile()?.path) {
					this.widget.handleVaultChange();
				}
			})
		);
		// 主窗口（含独立弹窗）里正在输入、尚未自动保存时也刷新，做到实时预览
		this.registerEvent(
			this.app.workspace.on("editor-change", (_editor, info) => {
				this.widget.handleEditorChange(info);
			})
		);
		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (oldPath !== this.settings.notePath || !(file instanceof TFile)) return;
				this.settings.notePath = file.path;
				void this.saveSettings();
				this.widget.scheduleRender();
			})
		);
		this.registerEvent(
			this.app.vault.on("delete", (file) => {
				if (file.path === this.settings.notePath) void this.widget.handleTargetChanged();
			})
		);

		this.app.workspace.onLayoutReady(() => {
			if (this.settings.widgetVisible) void this.widget.open();
		});
	}

	onunload(): void {
		// 保留“打开状态”记录，下次启动时恢复小部件
		this.widget?.destroy(true);
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	/** 设置项变更后同步到已打开的小部件 */
	applySettings(): void {
		this.widget?.applySettings();
	}

	/** 把设置里的 notePath 解析成库内文件 */
	getTargetFile(): TFile | null {
		const raw = (this.settings.notePath ?? "").trim();
		if (!raw) return null;

		const path = raw.replace(/^\/+/, "");
		const candidates = path.toLowerCase().endsWith(".md") ? [path] : [path, `${path}.md`];

		for (const candidate of candidates) {
			const file = this.app.vault.getAbstractFileByPath(candidate);
			if (file instanceof TFile) return file;
		}

		const byLink = this.app.metadataCache.getFirstLinkpathDest(path, "");
		if (byLink) return byLink;

		const lower = path.toLowerCase();
		return (
			this.app.vault
				.getMarkdownFiles()
				.find((file) => file.path.toLowerCase() === lower || file.basename.toLowerCase() === lower) ?? null
		);
	}
}
