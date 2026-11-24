import { MarkdownRenderer, MarkdownView, TFile } from "obsidian";
import type { MarkdownFileInfo } from "obsidian";
import type NoteWidgetPlugin from "./main";
import { buildShellDocument } from "./widget-ui";

interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface Point {
	x: number;
	y: number;
}

type SnapEdge = "left" | "right" | "top" | "bottom";

/** 收起后仍露在屏幕内的触发条宽度（DIP） */
const SLIVER = 6;
/** 判定“贴住边缘”的阈值（DIP） */
const SNAP_DISTANCE = 16;
/** 收起状态下鼠标位置轮询间隔 */
const HOVER_POLL_MS = 120;
/** 鼠标离开后连续多少次轮询才真正收起 */
const LEAVE_TICKS = 4;
const ACTION_PREFIX = "nw-action:";
/** 小部件窗口标题（动作消息会临时改写 document.title，需要在处理后还原） */
const WIDGET_TITLE = "笔记小部件";

/** 任务列表行：允许缩进、引用前缀，列表标记兼容 -、*、+ 与有序列表 */
const TASK_LINE_RE = /^\s*(?:>\s*)*(?:[-*+]|\d+[.)])\s+\[[ xX]\](?=\s|$)/;
/** 用于定位并只替换勾选字符（保留其余内容） */
const TASK_LINE_PARTS_RE = /^(\s*(?:>\s*)*(?:[-*+]|\d+[.)])\s+\[)([ xX])(\])/;

/** 收集 Markdown 源码中任务行的行号（0 起），跳过围栏代码块 */
function collectTaskLines(markdown: string): number[] {
	const lines = markdown.split("\n");
	const result: number[] = [];
	let fence: string | null = null;
	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];
		const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
		if (fenceMatch) {
			const marker = fenceMatch[1].charAt(0);
			if (fence === null) fence = marker;
			else if (fence === marker) fence = null;
			continue;
		}
		if (fence) continue;
		if (TASK_LINE_RE.test(line)) result.push(index);
	}
	return result;
}

function getElectron(): any {
	try {
		// Obsidian 桌面端渲染进程是带 node 集成的，可以直接拿到 electron 模块
		return require("electron");
	} catch {
		return null;
	}
}

function getRemote(): any {
	const electron = getElectron();
	if (!electron) return null;
	if (electron.remote) return electron.remote;
	try {
		return require("@electron/remote");
	} catch {
		return null;
	}
}

function clamp(value: number, min: number, max: number): number {
	if (max < min) max = min;
	return Math.max(min, Math.min(max, value));
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export class WidgetWindow {
	private win: any = null;
	private renderHost: HTMLElement | null = null;

	private cssCache: { css: string; links: string[] } | null = null;
	private injectedCss: string | null = null;
	private injectedLinks: string[] = [];

	private renderToken = 0;
	private renderTimer: number | null = null;
	private moveTimer: number | null = null;
	private resizeTimer: number | null = null;
	private hoverTimer: number | null = null;
	private animTimer: number | null = null;

	/** 程序化移动窗口时，忽略 move 事件触发的“用户拖动”逻辑 */
	private suppressUntil = 0;

	private snapEdge: SnapEdge | null = null;
	private hidden = false;
	/** 收起后，鼠标需先离开触发条一次，才允许再次滑出 */
	private revealArmed = false;
	private busy = false;
	private outsideTicks = 0;
	private preserveVisibleState = false;
	/** 最近一次渲染所用的 Markdown 原文，用于检测点击勾选前的外部改动 */
	private lastRenderSource: string | null = null;
	/** 最近一次渲染对应的笔记路径（切换笔记时即使内容相同也要重绘） */
	private lastRenderPath: string | null = null;
	/** 下一次去抖渲染是否强制跳过「内容未变」判断 */
	private forceRender = false;
	/** 勾选写回进行中，避免连点造成重复翻转 */
	private taskBusy = false;

	constructor(private plugin: NoteWidgetPlugin) {
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("css-change", () => {
				this.cssCache = null;
				this.scheduleRender(120, true);
			})
		);
	}

	isOpen(): boolean {
		return !!this.win && !this.win.isDestroyed();
	}

	async toggle(): Promise<void> {
		if (this.isOpen()) await this.close();
		else await this.open();
	}

	async open(): Promise<void> {
		if (this.isOpen()) {
			this.win.show();
			this.win.focus();
			return;
		}
		const remote = getRemote();
		if (!remote || !remote.BrowserWindow) {
			console.error("[note-widget] 无法获取 Electron 的 BrowserWindow，当前环境不支持独立窗口");
			return;
		}

		const settings = this.plugin.settings;
		const bounds = this.initialBounds();

		const win = new remote.BrowserWindow({
			x: bounds.x,
			y: bounds.y,
			width: bounds.width,
			height: bounds.height,
			frame: false,
			transparent: false,
			resizable: true,
			movable: true,
			minimizable: false,
			maximizable: false,
			fullscreenable: false,
			skipTaskbar: false,
			alwaysOnTop: settings.alwaysOnTop,
			backgroundColor: this.themeBackground(),
			title: WIDGET_TITLE,
			show: false,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				sandbox: false,
				// 小部件内容全部来自本地库，关闭 webSecurity 以便 app:// 图片和本地字体正常加载
				webSecurity: false,
				spellcheck: false,
				backgroundThrottling: false,
			},
		});
		this.win = win;
		this.registerWindowEvents(win);

		try {
			await win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(buildShellDocument()));
		} catch (error) {
			console.error("[note-widget] 小部件窗口加载失败", error);
		}
		if (!this.isOpen()) return;

		this.applySettings();
		win.show();
		settings.widgetVisible = true;
		await this.plugin.saveSettings();

		await this.render();
		this.restoreSnappedState();
	}

	async close(): Promise<void> {
		const win = this.win;
		if (win && !win.isDestroyed()) win.destroy();
		else this.handleClosed();
	}

	/** 插件卸载时调用：destroy(true) 保留“上次开着”的状态，便于重启后恢复 */
	destroy(preserveVisibleState = false): void {
		this.preserveVisibleState = preserveVisibleState;
		const win = this.win;
		if (win && !win.isDestroyed()) win.destroy();
		else this.handleClosed();
	}

	applySettings(): void {
		const win = this.win;
		if (!win || win.isDestroyed()) return;
		const settings = this.plugin.settings;

		win.setAlwaysOnTop(settings.alwaysOnTop, "floating");
		win.setOpacity(clamp(settings.opacity, 0.3, 1));
		try {
			win.webContents.setZoomFactor(clamp(settings.zoom, 0.6, 2));
		} catch {
			/* 窗口可能已经销毁 */
		}

		const bounds = win.getBounds();
		const width = clamp(Math.round(settings.width), 220, 1600);
		const height = clamp(Math.round(settings.height), 180, 1600);
		if (Math.abs(bounds.width - width) > 4 || Math.abs(bounds.height - height) > 4) {
			win.setSize(width, height);
		}

		void this.exec(
			`(function(){var b=document.querySelector('[data-nw-action="pin"]');if(b)b.classList.toggle('is-active',${settings.alwaysOnTop ? "true" : "false"});})()`
		);

		if (!settings.snapAutoHide) {
			this.stopHoverWatch();
			this.snapEdge = null;
			if (this.hidden) {
				this.hidden = false;
				void this.exec("window.__nwSetCollapsed && window.__nwSetCollapsed(false)");
			}
		}
	}

	scheduleRender(delay = 250, force = false): void {
		if (force) this.forceRender = true;
		if (this.renderTimer) window.clearTimeout(this.renderTimer);
		this.renderTimer = window.setTimeout(() => {
			this.renderTimer = null;
			const forceNext = this.forceRender;
			this.forceRender = false;
			void this.render(forceNext);
		}, delay);
	}

	/**
	 * 渲染目标笔记。force=false 时若内容与上次一致就跳过 DOM 更新，
	 * 避免自身写回（保存、勾选待办）触发的 vault 事件造成重复刷新和闪烁。
	 */
	async render(force = false): Promise<void> {
		const win = this.win;
		if (!win || win.isDestroyed()) return;

		const token = ++this.renderToken;
		const file = this.plugin.getTargetFile();
		let html: string | null;
		let source: string | null;
		let title: string;

		if (!file) {
			title = "笔记小部件";
			source = null;
			html =
				`<div class="nw-empty"><div class="nw-empty-title">未选择笔记</div>` +
				`<div class="nw-empty-desc">打开「设置 → 笔记小部件」，填入笔记路径或点击「选择」从库中挑一条笔记。</div></div>`;
		} else {
			title = file.basename;
			const body = await this.buildBody(file, force);
			html = body.html;
			source = body.source;
		}

		if (html === null) return;
		if (token !== this.renderToken) return;
		if (!this.isOpen()) return;

		const payload = {
			title,
			html,
			theme: this.themeClass(),
			pinned: this.plugin.settings.alwaysOnTop,
			css: this.cssForInjection(),
			links: this.linksForInjection(),
			htmlStyle: document.documentElement.getAttribute("style") ?? "",
			bodyStyle: document.body.getAttribute("style") ?? "",
		};

		try {
			await win.webContents.executeJavaScript(
				`window.__nwUpdate && window.__nwUpdate(${JSON.stringify(payload)})`,
				true
			);
		} catch {
			/* 窗口正在关闭 */
		}

		this.lastRenderSource = source;
		this.lastRenderPath = file?.path ?? null;
	}

	/**
	 * 计算要渲染的 HTML。html 为 null 表示内容没变、无需更新小部件。
	 */
	private async buildBody(file: TFile, force: boolean): Promise<{ html: string | null; source: string | null }> {
		let source: string;
		try {
			source = await this.readSource(file);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			return {
				html: `<div class="nw-empty"><div class="nw-empty-title">渲染失败</div><div class="nw-empty-desc">${escapeHtml(message)}</div></div>`,
				source: null,
			};
		}
		if (!force && source === this.lastRenderSource && this.lastRenderPath === file.path) {
			return { html: null, source };
		}
		return { html: await this.renderNoteHtml(file, source), source };
	}

	/**
	 * 目标笔记的当前内容：若它正开在某个标签页（含独立弹窗）里，就以编辑器里的内容为准，
	 * 这样主窗口还在输入、尚未自动保存时小部件也能实时跟上；否则读磁盘缓存。
	 */
	private async readSource(file: TFile): Promise<string> {
		const live = this.liveEditorSource(file);
		if (live !== null) return live;
		return await this.plugin.app.vault.cachedRead(file);
	}

	private liveEditorSource(file: TFile): string | null {
		for (const leaf of this.plugin.app.workspace.getLeavesOfType("markdown")) {
			const view = leaf.view;
			if (!(view instanceof MarkdownView)) continue;
			if (view.file?.path !== file.path) continue;
			try {
				const value = view.editor.getValue();
				return typeof value === "string" ? value : null;
			} catch {
				return null;
			}
		}
		return null;
	}

	// ---------------------------------------------------------------- 窗口事件

	private registerWindowEvents(win: any): void {
		win.on("move", () => this.onMove());
		win.on("resize", () => this.onResize());
		win.on("closed", () => this.handleClosed());

		const webContents = win.webContents;
		webContents.on("page-title-updated", (event: any, title: string) => {
			event.preventDefault();
			this.onActionMessage(title);
			// remote 环境下 preventDefault 不一定能阻止原生标题变更，这里显式还原
			if (!win.isDestroyed()) win.setTitle(WIDGET_TITLE);
		});
		webContents.on("will-navigate", (event: any, url: string) => {
			event.preventDefault();
			this.handleNavigatedUrl(url);
		});
		if (typeof webContents.setWindowOpenHandler === "function") {
			try {
				webContents.setWindowOpenHandler(() => ({ action: "deny" }));
			} catch {
				/* 老版本 Electron 没有该 API */
			}
		}
	}

	private handleClosed(): void {
		this.win = null;
		this.clearTimers();
		this.injectedCss = null;
		this.snapEdge = null;
		this.hidden = false;
		this.revealArmed = false;
		this.busy = false;
		this.lastRenderSource = null;
		this.lastRenderPath = null;
		this.forceRender = false;
		this.taskBusy = false;
		this.cleanupHost();

		if (!this.preserveVisibleState) {
			this.plugin.settings.widgetVisible = false;
			void this.plugin.saveSettings();
		}
		this.preserveVisibleState = false;
	}

	/**
	 * 小部件窗口通过改写 document.title 把交互回传给插件（无需 preload / IPC）。
	 * 格式：nw-action:<kind>:<seq>:<urlencoded payload>
	 */
	private onActionMessage(title: string): void {
		if (typeof title !== "string" || !title.startsWith(ACTION_PREFIX)) return;
		const rest = title.slice(ACTION_PREFIX.length);
		const firstSep = rest.indexOf(":");
		if (firstSep < 0) return;
		const kind = rest.slice(0, firstSep);
		const tail = rest.slice(firstSep + 1);
		const secondSep = tail.indexOf(":");
		if (secondSep < 0) return;
		let payload = tail.slice(secondSep + 1);
		try {
			payload = decodeURIComponent(payload);
		} catch {
			/* 保留原值 */
		}
		void this.handleAction(kind, payload);
	}

	private async handleAction(kind: string, payload: string): Promise<void> {
		switch (kind) {
			case "pin":
				await this.setPinned(!this.plugin.settings.alwaysOnTop);
				break;
			case "refresh":
				await this.render(true);
				break;
			case "close":
				await this.close();
				break;
			case "open":
				if (payload) await this.plugin.app.workspace.openLinkText(payload, "", false);
				break;
			case "external":
				this.openExternal(payload);
				break;
			case "edit":
				await this.openInEditor();
				break;
			case "pick":
				await this.showNotePicker();
				break;
			case "pick-note":
				await this.chooseNote(payload);
				break;
			case "task":
				await this.toggleTask(payload);
				break;
		}
	}

	private handleNavigatedUrl(rawUrl: string): void {
		let url: URL;
		try {
			url = new URL(rawUrl);
		} catch {
			return;
		}
		if (url.protocol === "notewidget:") {
			const kind = url.host || url.pathname.replace(/^\/+/, "");
			const payload = url.searchParams.get("file") ?? url.searchParams.get("url") ?? "";
			void this.handleAction(kind, payload);
			return;
		}
		if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") {
			this.openExternal(rawUrl);
		}
	}

	private openExternal(rawUrl: string): void {
		if (!rawUrl) return;
		try {
			const parsed = new URL(rawUrl);
			if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) return;
		} catch {
			return;
		}
		const electron = getElectron();
		if (electron?.shell?.openExternal) {
			void electron.shell.openExternal(rawUrl);
		} else {
			window.open(rawUrl);
		}
	}

	private async setPinned(pinned: boolean): Promise<void> {
		this.plugin.settings.alwaysOnTop = pinned;
		if (this.isOpen()) this.win.setAlwaysOnTop(pinned, "floating");
		await this.plugin.saveSettings();
		await this.exec(
			`(function(){var b=document.querySelector('[data-nw-action="pin"]');if(b)b.classList.toggle('is-active',${pinned ? "true" : "false"});})()`
		);
	}

	/**
	 * 编辑入口：在主窗口打开目标笔记并切到可编辑的源码模式，然后把主窗口带到前台。
	 * 已打开则复用标签，没有就新开一个。
	 */
	private async openInEditor(): Promise<void> {
		const file = this.plugin.getTargetFile();
		if (!file) {
			await this.banner("未找到目标笔记，请先在设置中选择", "error");
			return;
		}
		try {
			await this.plugin.app.vault.read(file);
		} catch {
			await this.banner("读取笔记失败，无法打开", "error");
			return;
		}

		const workspace = this.plugin.app.workspace;
		let leaf = workspace
			.getLeavesOfType("markdown")
			.find((item) => (item.view as MarkdownView).file?.path === file.path);
		if (!leaf) {
			leaf = workspace.getLeaf("tab");
			try {
				await leaf.openFile(file);
			} catch {
				await this.banner("打开笔记失败", "error");
				return;
			}
		}
		const view = leaf.view as MarkdownView;
		// 阅读模式不可输入，切回编辑（源码）模式；已在编辑模式则保持原样，避免重建视图
		const viewState = leaf.getViewState();
		if (!viewState.state || viewState.state.mode !== "source") {
			try {
				await leaf.setViewState({
					type: "markdown",
					state: Object.assign({}, viewState.state, { file: file.path, mode: "source" }),
				});
			} catch {
				await this.banner("切换编辑模式失败", "error");
				return;
			}
		}

		const mainWindow = getRemote()?.getCurrentWindow?.();
		if (mainWindow && !mainWindow.isDestroyed()) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.show();
			mainWindow.focus();
		}
		workspace.setActiveLeaf(leaf, { focus: true });
		(leaf.view as MarkdownView).editor?.focus();
	}

	/** 在小部件内弹出笔记选择面板，笔记列表由主窗口提供 */
	private async showNotePicker(): Promise<void> {
		const notes = this.plugin.app.vault
			.getMarkdownFiles()
			.map((file) => file.path)
			.sort((a, b) => a.localeCompare(b, "zh"));
		const current = this.plugin.getTargetFile()?.path ?? this.plugin.settings.notePath;
		await this.exec(
			`window.__nwShowPicker && window.__nwShowPicker(${JSON.stringify({ notes, current })})`
		);
	}

	/** 选中某条笔记：写入设置并立即切换显示 */
	private async chooseNote(path: string): Promise<void> {
		const file = this.plugin.app.vault.getAbstractFileByPath(path);
		if (!(file instanceof TFile)) {
			await this.banner("找不到这条笔记，请刷新后重试", "error");
			return;
		}
		this.plugin.settings.notePath = file.path;
		await this.plugin.saveSettings();
		await this.handleTargetChanged();
	}

	// --------------------------------------------------------------- 提示条

	private async banner(message: string, kind: "info" | "error" = "info"): Promise<void> {
		await this.exec(`window.__nwBanner && window.__nwBanner(${JSON.stringify(message)}, ${JSON.stringify(kind)})`);
	}

	/** 目标笔记内容变化：去抖刷新渲染（内容未变时自动跳过） */
	handleVaultChange(): void {
		this.scheduleRender();
	}

	/**
	 * 主窗口（含独立弹窗）里正在编辑目标笔记：去抖后刷新预览，拿到未保存的实时内容。
	 */
	handleEditorChange(info: MarkdownFileInfo | null): void {
		if (!this.isOpen()) return;
		const file = info?.file;
		if (!(file instanceof TFile)) return;
		const target = this.plugin.getTargetFile();
		if (!target || target.path !== file.path) return;
		this.scheduleRender();
	}

	/** 目标笔记被切换或删除：重新渲染 */
	async handleTargetChanged(): Promise<void> {
		await this.render(true);
	}

	// ------------------------------------------------------------------- 任务勾选

	/**
	 * 点击渲染模式下的任务复选框：把对应源码行的勾选状态写回笔记。
	 * 行号来自渲染时的任务行顺序映射（见 annotateTaskCheckboxes）。
	 * 若笔记在渲染后被别处改过，只刷新并提示，不覆盖。
	 */
	private async toggleTask(payload: string): Promise<void> {
		if (this.taskBusy) return;
		const lineIndex = Number(payload);
		if (!Number.isInteger(lineIndex) || lineIndex < 0) return;

		const file = this.plugin.getTargetFile();
		if (!file) {
			await this.banner("未找到目标笔记", "error");
			return;
		}

		let source: string;
		try {
			source = await this.plugin.app.vault.read(file);
		} catch {
			await this.banner("读取笔记失败，勾选未保存", "error");
			return;
		}
		if (this.lastRenderSource !== null && source !== this.lastRenderSource) {
			await this.render(true);
			await this.banner("笔记已在别处被修改，已刷新，请重新勾选", "error");
			return;
		}

		const lines = source.split("\n");
		const line = lines[lineIndex];
		const parts = typeof line === "string" ? TASK_LINE_PARTS_RE.exec(line) : null;
		if (!parts) {
			await this.render(true);
			await this.banner("没有找到对应的任务行，已刷新", "error");
			return;
		}
		const nextMark = parts[2] === " " ? "x" : " ";
		lines[lineIndex] = parts[1] + nextMark + parts[3] + line.slice(parts[0].length);
		const nextSource = lines.join("\n");

		this.taskBusy = true;
		let conflict = false;
		try {
			// process 会基于最新内容写入，避免在读取与写入之间被外部改动后静默覆盖
			await this.plugin.app.vault.process(file, (data) => {
				if (data !== source) {
					conflict = true;
					return data;
				}
				return nextSource;
			});
		} catch {
			this.taskBusy = false;
			await this.banner("写回笔记失败，勾选未保存", "error");
			return;
		}
		this.taskBusy = false;

		await this.render(true);
		if (conflict) {
			await this.banner("笔记已在别处被修改，已刷新，请重新勾选", "error");
		}
	}

	// ------------------------------------------------------------------- 渲染

	private async renderNoteHtml(file: TFile, source: string): Promise<string> {
		const app = this.plugin.app;
		const host = this.getRenderHost();
		host.empty();

		const windowWidth = this.isOpen() ? this.win.getBounds().width : this.plugin.settings.width;
		host.style.width = `${Math.max(200, windowWidth - 28)}px`;

		try {
			const taskLines = collectTaskLines(source);
			await MarkdownRenderer.render(app, source, host, file.path, this.plugin);
			// 给 Dataview / Mermaid 之类的异步后处理器一点时间
			await new Promise<void>((resolve) => window.setTimeout(resolve, 80));
			this.rewriteLinks(host, file);
			this.annotateTaskCheckboxes(host, taskLines);
			return host.innerHTML;
		} finally {
			host.empty();
		}
	}

	private rewriteLinks(host: HTMLElement, source: TFile): void {
		host.querySelectorAll("a").forEach((anchor) => {
			const href = anchor.getAttribute("href") ?? "";
			const dataHref = anchor.getAttribute("data-href") ?? href;

			if (anchor.classList.contains("internal-link") || anchor.hasAttribute("data-href")) {
				const dest = this.plugin.app.metadataCache.getFirstLinkpathDest(dataHref, source.path);
				if (dest) anchor.setAttribute("data-nw-open", dest.path);
				anchor.removeAttribute("href");
				return;
			}
			if (/^javascript:/i.test(href)) {
				anchor.removeAttribute("href");
				return;
			}
			if (/^(https?:|mailto:)/i.test(href) || anchor.classList.contains("external-link")) {
				if (href) anchor.setAttribute("data-nw-external", href);
			}
		});
	}

	private annotateTaskCheckboxes(host: HTMLElement, taskLines: number[]): void {
		const boxes = host.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
		// 数量不一致说明有额外/缺失的复选框（例如插件动态生成），此时不标注，保持只读以免改错行
		if (!boxes.length || boxes.length !== taskLines.length) return;
		boxes.forEach((box, index) => {
			box.setAttribute("data-nw-task", String(taskLines[index]));
			// 渲染结果默认是禁用状态，放开禁用才能触发点击
			box.removeAttribute("disabled");
			box.disabled = false;
		});
	}

	private getRenderHost(): HTMLElement {
		if (!this.renderHost || !this.renderHost.isConnected) {
			this.renderHost = document.body.createDiv({ cls: "note-widget-render-host" });
		}
		return this.renderHost;
	}

	private cleanupHost(): void {
		if (this.renderHost?.isConnected) this.renderHost.remove();
		this.renderHost = null;
	}

	private collectStyles(): { css: string; links: string[] } {
		const chunks: string[] = [];
		document.querySelectorAll("style").forEach((style) => {
			const text = style.textContent;
			if (text && text.trim()) chunks.push(text);
		});
		const links: string[] = [];
		document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
			const href = (link as HTMLLinkElement).href;
			if (href) links.push(href);
		});
		return { css: chunks.join("\n"), links };
	}

	private cssForInjection(): string | null {
		if (this.cssCache === null) this.cssCache = this.collectStyles();
		if (this.cssCache.css === this.injectedCss) return null;
		this.injectedCss = this.cssCache.css;
		return this.cssCache.css;
	}

	private linksForInjection(): string[] {
		if (this.cssCache === null) this.cssCache = this.collectStyles();
		const next = this.cssCache.links;
		if (next.length === this.injectedLinks.length && next.every((href, i) => href === this.injectedLinks[i])) {
			return this.injectedLinks;
		}
		this.injectedLinks = next;
		return next;
	}

	private themeClass(): string {
		return document.body.classList.contains("theme-light") ? "theme-light" : "theme-dark";
	}

	private themeBackground(): string {
		const color = getComputedStyle(document.body).backgroundColor;
		return color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent" ? color : "#1e1e1e";
	}

	// ------------------------------------------------------------------- 布局

	private initialBounds(): Rect {
		const settings = this.plugin.settings;
		const width = clamp(Math.round(settings.width), 220, 1600);
		const height = clamp(Math.round(settings.height), 180, 1600);
		const remote = getRemote();
		const screen = remote?.screen;

		if (settings.x === null || settings.y === null) {
			const workArea: Rect = screen
				? screen.getPrimaryDisplay().workArea
				: { x: 0, y: 0, width: window.screen.availWidth, height: window.screen.availHeight };
			return {
				x: workArea.x + workArea.width - width - 24,
				y: workArea.y + workArea.height - height - 24,
				width,
				height,
			};
		}

		let x = settings.x;
		let y = settings.y;
		if (screen) {
			const display = screen.getDisplayNearestPoint({ x, y });
			const workArea: Rect = display.workArea;
			x = clamp(x, workArea.x, workArea.x + workArea.width - width);
			y = clamp(y, workArea.y, workArea.y + workArea.height - height);
		}
		return { x, y, width, height };
	}

	private onMove(): void {
		if (!this.isOpen()) return;
		if (this.hidden || this.busy) return;
		if (Date.now() < this.suppressUntil) return;
		if (this.moveTimer) window.clearTimeout(this.moveTimer);
		this.moveTimer = window.setTimeout(() => {
			this.moveTimer = null;
			void this.afterUserMove();
		}, 300);
	}

	private async afterUserMove(): Promise<void> {
		if (!this.isOpen() || this.hidden) return;
		this.savePosition();
		if (!this.plugin.settings.snapAutoHide) return;
		const edge = this.detectEdge();
		if (edge) await this.collapseToEdge(edge);
	}

	private onResize(): void {
		if (!this.isOpen()) return;
		if (Date.now() < this.suppressUntil) return;
		if (this.resizeTimer) window.clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(() => {
			this.resizeTimer = null;
			if (!this.isOpen()) return;
			const bounds = this.win.getBounds();
			const settings = this.plugin.settings;
			// 忽略 DPI 舍入带来的 1~3px 抖动，避免设置里记录的尺寸被逐步放大
			if (Math.abs(bounds.width - settings.width) <= 4 && Math.abs(bounds.height - settings.height) <= 4) return;
			settings.width = bounds.width;
			settings.height = bounds.height;
			void this.plugin.saveSettings();
			this.scheduleRender(180, true);
		}, 300);
	}

	private savePosition(): void {
		if (!this.isOpen()) return;
		const bounds = this.win.getBounds();
		const settings = this.plugin.settings;
		if (settings.x === bounds.x && settings.y === bounds.y) return;
		settings.x = bounds.x;
		settings.y = bounds.y;
		void this.plugin.saveSettings();
	}

	// --------------------------------------------------------------- 贴边收起

	private restoreSnappedState(): void {
		if (!this.isOpen() || !this.plugin.settings.snapAutoHide) return;
		const edge = this.detectEdge();
		if (!edge) return;
		this.snapEdge = edge;
		this.hidden = false;
		this.revealArmed = true;
		this.startHoverWatch();
	}

	private detectEdge(): SnapEdge | null {
		if (!this.isOpen()) return null;
		const bounds = this.win.getBounds();
		const workArea = this.workArea(bounds);
		const distances: Record<SnapEdge, number> = {
			left: Math.abs(bounds.x - workArea.x),
			right: Math.abs(workArea.x + workArea.width - (bounds.x + bounds.width)),
			top: Math.abs(bounds.y - workArea.y),
			bottom: Math.abs(workArea.y + workArea.height - (bounds.y + bounds.height)),
		};

		let best: SnapEdge | null = null;
		let minimum = SNAP_DISTANCE + 1;
		(["left", "right", "top", "bottom"] as SnapEdge[]).forEach((edge) => {
			if (distances[edge] < minimum) {
				minimum = distances[edge];
				best = edge;
			}
		});
		return best;
	}

	private workArea(bounds: Rect): Rect {
		const remote = getRemote();
		const screen = remote?.screen;
		if (screen?.getDisplayMatching) {
			const display = screen.getDisplayMatching(bounds);
			const area = display?.workArea;
			if (area && [area.x, area.y, area.width, area.height].every((v: unknown) => Number.isFinite(v))) {
				return area;
			}
		}
		return { x: 0, y: 0, width: window.screen.availWidth, height: window.screen.availHeight };
	}

	private flushBounds(edge: SnapEdge, bounds: Rect, workArea: Rect): Point {
		switch (edge) {
			case "left":
				return { x: workArea.x, y: bounds.y };
			case "right":
				return { x: workArea.x + workArea.width - bounds.width, y: bounds.y };
			case "top":
				return { x: bounds.x, y: workArea.y };
			case "bottom":
				return { x: bounds.x, y: workArea.y + workArea.height - bounds.height };
		}
		return { x: bounds.x, y: bounds.y };
	}

	private hiddenPosition(edge: SnapEdge, bounds: Rect, workArea: Rect): Point {
		switch (edge) {
			case "left":
				return { x: workArea.x - bounds.width + SLIVER, y: bounds.y };
			case "right":
				return { x: workArea.x + workArea.width - SLIVER, y: bounds.y };
			case "top":
				return { x: bounds.x, y: workArea.y - bounds.height + SLIVER };
			case "bottom":
				return { x: bounds.x, y: workArea.y + workArea.height - SLIVER };
		}
		return { x: bounds.x, y: bounds.y };
	}

	private async collapseToEdge(edge: SnapEdge): Promise<void> {
		if (!this.isOpen() || this.busy) return;
		this.busy = true;
		try {
			const bounds = this.win.getBounds();
			const workArea = this.workArea(bounds);
			this.snapEdge = edge;

			const flush = this.flushBounds(edge, bounds, workArea);
			await this.animateTo(flush, 120);

			// 记住“贴着边但完整可见”的位置，下次启动据此恢复
			this.plugin.settings.x = flush.x;
			this.plugin.settings.y = flush.y;
			void this.plugin.saveSettings();

			const target = this.hiddenPosition(edge, bounds, workArea);
			await this.animateTo(target, 170);
			this.hidden = true;
			this.revealArmed = false;
			await this.exec(`window.__nwSetCollapsed && window.__nwSetCollapsed(true, '${edge}')`);
			this.startHoverWatch();
		} finally {
			this.busy = false;
		}
	}

	private async expand(): Promise<void> {
		if (!this.isOpen() || this.busy || !this.snapEdge) return;
		this.busy = true;
		try {
			await this.exec("window.__nwSetCollapsed && window.__nwSetCollapsed(false)");
			const bounds = this.win.getBounds();
			const workArea = this.workArea(bounds);
			const flush = this.flushBounds(this.snapEdge, bounds, workArea);
			this.hidden = false;
			this.outsideTicks = 0;
			this.revealArmed = true;
			await this.animateTo(flush, 150);
		} finally {
			this.busy = false;
		}
	}

	private async collapseAgain(): Promise<void> {
		if (!this.isOpen() || this.busy || !this.snapEdge) return;
		this.busy = true;
		try {
			const bounds = this.win.getBounds();
			const workArea = this.workArea(bounds);
			const target = this.hiddenPosition(this.snapEdge, bounds, workArea);
			await this.animateTo(target, 170);
			this.hidden = true;
			this.revealArmed = false;
			await this.exec(`window.__nwSetCollapsed && window.__nwSetCollapsed(true, '${this.snapEdge}')`);
		} finally {
			this.busy = false;
		}
	}

	private startHoverWatch(): void {
		if (this.hoverTimer) return;
		this.outsideTicks = 0;
		this.hoverTimer = window.setInterval(() => this.hoverTick(), HOVER_POLL_MS);
	}

	private stopHoverWatch(): void {
		if (this.hoverTimer) {
			window.clearInterval(this.hoverTimer);
			this.hoverTimer = null;
		}
		this.outsideTicks = 0;
	}

	private hoverTick(): void {
		if (!this.isOpen()) {
			this.stopHoverWatch();
			return;
		}
		if (!this.plugin.settings.snapAutoHide || !this.snapEdge) {
			this.stopHoverWatch();
			return;
		}
		if (this.busy) return;

		const point = this.cursorPoint();
		if (!point) return;

		if (this.hidden) {
			const inside = this.pointInRect(point, this.triggerRect(this.snapEdge));
			// 刚收起时鼠标通常还压在窗口上，先等它离开一次，避免立刻又滑出
			if (!this.revealArmed) {
				if (!inside) this.revealArmed = true;
				return;
			}
			if (inside) void this.expand();
			return;
		}

		if (this.pointInRect(point, this.inflateRect(this.win.getBounds(), 10))) {
			this.outsideTicks = 0;
			return;
		}
		this.outsideTicks += 1;
		if (this.outsideTicks >= LEAVE_TICKS) {
			this.outsideTicks = 0;
			void this.collapseAgain();
		}
	}

	private triggerRect(edge: SnapEdge): Rect {
		const bounds = this.win.getBounds();
		const workArea = this.workArea(bounds);
		const thickness = SLIVER + 6;
		switch (edge) {
			case "left":
				return { x: workArea.x, y: bounds.y, width: thickness, height: bounds.height };
			case "right":
				return {
					x: workArea.x + workArea.width - thickness,
					y: bounds.y,
					width: thickness,
					height: bounds.height,
				};
			case "top":
				return { x: bounds.x, y: workArea.y, width: bounds.width, height: thickness };
			case "bottom":
				return {
					x: bounds.x,
					y: workArea.y + workArea.height - thickness,
					width: bounds.width,
					height: thickness,
				};
		}
	}

	private inflateRect(bounds: Rect, amount: number): Rect {
		return {
			x: bounds.x - amount,
			y: bounds.y - amount,
			width: bounds.width + amount * 2,
			height: bounds.height + amount * 2,
		};
	}

	private pointInRect(point: Point, rect: Rect): boolean {
		return (
			point.x >= rect.x &&
			point.x <= rect.x + rect.width &&
			point.y >= rect.y &&
			point.y <= rect.y + rect.height
		);
	}

	private cursorPoint(): Point | null {
		const screen = getRemote()?.screen;
		if (!screen?.getCursorScreenPoint) return null;
		const point = screen.getCursorScreenPoint();
		return { x: point.x, y: point.y };
	}

	private async animateTo(target: Point, duration: number): Promise<void> {
		const win = this.win;
		if (!win || win.isDestroyed()) return;
		if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.y)) {
			console.warn("[note-widget] 忽略无效的窗口位置", target);
			return;
		}

		// 同一时间只保留一个位移动画
		if (this.animTimer) {
			window.clearTimeout(this.animTimer);
			this.animTimer = null;
		}

		let startX = 0;
		let startY = 0;
		try {
			const position = win.getPosition();
			startX = Number(position?.[0]);
			startY = Number(position?.[1]);
		} catch {
			return;
		}
		if (!Number.isFinite(startX) || !Number.isFinite(startY)) return;

		// 位移时一并固定窗口尺寸（取设置里的目标值），避免 DPI 舍入让窗口逐步变大
		const settings = this.plugin.settings;
		let frameWidth = clamp(Math.round(settings.width), 220, 1600);
		let frameHeight = clamp(Math.round(settings.height), 180, 1600);
		if (!Number.isFinite(frameWidth) || !Number.isFinite(frameHeight)) {
			try {
				const bounds = win.getBounds();
				frameWidth = bounds.width;
				frameHeight = bounds.height;
			} catch {
				return;
			}
		}
		if (!Number.isFinite(frameWidth) || !Number.isFinite(frameHeight) || frameWidth <= 0 || frameHeight <= 0) return;
		if (Math.abs(startX - target.x) < 1 && Math.abs(startY - target.y) < 1) return;

		this.suppressUntil = Date.now() + duration + 600;
		const startedAt = Date.now();

		await new Promise<void>((resolve) => {
			const step = () => {
				this.animTimer = null;
				if (!this.isOpen()) {
					resolve();
					return;
				}
				const progress = Math.min(1, (Date.now() - startedAt) / duration);
				const eased = 1 - Math.pow(1 - progress, 3);
				const x = Math.round(startX + (target.x - startX) * eased);
				const y = Math.round(startY + (target.y - startY) * eased);
				try {
					// 注意：不能用 setPosition —— Electron 在 Windows 上对有边框样式的无边框窗口
					// 每次 setPosition 都会因 DPI 舍入把窗口撑大，这里固定尺寸一起设置
					this.win.setBounds({ x, y, width: frameWidth, height: frameHeight }, false);
				} catch (error) {
					console.warn("[note-widget] 移动窗口失败", error);
					resolve();
					return;
				}
				if (progress < 1) this.animTimer = window.setTimeout(step, 16);
				else resolve();
			};
			step();
		});
	}

	private clearTimers(): void {
		if (this.renderTimer) window.clearTimeout(this.renderTimer);
		if (this.moveTimer) window.clearTimeout(this.moveTimer);
		if (this.resizeTimer) window.clearTimeout(this.resizeTimer);
		if (this.animTimer) window.clearTimeout(this.animTimer);
		this.renderTimer = null;
		this.moveTimer = null;
		this.resizeTimer = null;
		this.animTimer = null;
		this.stopHoverWatch();
	}

	private async exec(script: string): Promise<void> {
		if (!this.isOpen()) return;
		try {
			await this.win.webContents.executeJavaScript(script, true);
		} catch {
			/* 忽略窗口关闭过程中的执行失败 */
		}
	}
}
