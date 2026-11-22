/*
Obsidian Note Widget
*/
"use strict";var b=Object.defineProperty;var M=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var H=Object.prototype.hasOwnProperty;var D=(d,e)=>{for(var t in e)b(d,t,{get:e[t],enumerable:!0})},R=(d,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of N(e))!H.call(d,n)&&n!==t&&b(d,n,{get:()=>e[n],enumerable:!(i=M(e,n))||i.enumerable});return d};var I=d=>R(b({},"__esModule",{value:!0}),d);var X={};D(X,{default:()=>v});module.exports=I(X);var p=require("obsidian");var h=require("obsidian"),S={notePath:"",alwaysOnTop:!0,snapAutoHide:!0,opacity:1,zoom:1,width:360,height:480,x:null,y:null,widgetVisible:!1},y=class extends h.FuzzySuggestModal{constructor(t,i){super(t);this.onPick=i;this.setPlaceholder("\u641C\u7D22\u5E93\u4E2D\u7684\u7B14\u8BB0\u2026")}getItems(){return this.app.vault.getMarkdownFiles()}getItemText(t){return t.path}onChooseItem(t){this.onPick(t)}},w=class extends h.PluginSettingTab{constructor(t,i){super(t,i);this.plugin=i;this.statusEl=null;this.pathText=null}display(){let{containerEl:t}=this;t.empty(),t.addClass("note-widget-settings"),t.createEl("h2",{text:"\u7B14\u8BB0\u5C0F\u90E8\u4EF6"}),t.createEl("p",{cls:"setting-item-description",text:"\u5C0F\u90E8\u4EF6\u662F\u4E00\u4E2A\u72EC\u7ACB\u4E8E Obsidian \u4E3B\u7A97\u53E3\u7684\u65E0\u8FB9\u6846\u684C\u9762\u7A97\u53E3\uFF08\u4EC5\u684C\u9762\u7AEF\u53EF\u7528\uFF09\u3002\u62D6\u52A8\u6807\u9898\u680F\u53EF\u79FB\u52A8\u7A97\u53E3\uFF0C\u62D6\u52A8\u7A97\u53E3\u8FB9\u7F18\u53EF\u6539\u53D8\u5927\u5C0F\u3002"}),new h.Setting(t).setName("\u76EE\u6807\u7B14\u8BB0").setDesc("\u586B\u5199\u5E93\u5185\u76F8\u5BF9\u8DEF\u5F84\uFF08\u4F8B\u5982 Notes/\u4ECA\u65E5\u5F85\u529E.md\uFF09\uFF0C\u6216\u70B9\u51FB\u300C\u9009\u62E9\u300D\u4ECE\u5E93\u4E2D\u6311\u9009\u3002").addText(i=>{this.pathText=i,i.setPlaceholder("Notes/\u4ECA\u65E5\u5F85\u529E.md").setValue(this.plugin.settings.notePath).onChange(async n=>{this.plugin.settings.notePath=n.trim(),await this.plugin.saveSettings(),this.plugin.widget.handleTargetChanged(),this.refreshStatus()})}).addButton(i=>{i.setButtonText("\u9009\u62E9").onClick(()=>{new y(this.app,async n=>{var s;this.plugin.settings.notePath=n.path,await this.plugin.saveSettings(),(s=this.pathText)==null||s.setValue(n.path),this.plugin.widget.handleTargetChanged(),this.refreshStatus()}).open()})}),this.statusEl=t.createDiv({cls:"note-widget-status"}),this.refreshStatus(),new h.Setting(t).setName("\u59CB\u7EC8\u7F6E\u9876").setDesc("\u8BA9\u5C0F\u90E8\u4EF6\u59CB\u7EC8\u663E\u793A\u5728\u5176\u4ED6\u7A97\u53E3\u4E4B\u4E0A\uFF0C\u4E5F\u53EF\u4EE5\u5728\u7A97\u53E3\u53F3\u4E0A\u89D2\u7684\u9762\u677F\u6309\u94AE\u91CC\u968F\u65F6\u5207\u6362\u3002").addToggle(i=>i.setValue(this.plugin.settings.alwaysOnTop).onChange(async n=>{this.plugin.settings.alwaysOnTop=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new h.Setting(t).setName("\u8D34\u8FB9\u81EA\u52A8\u9690\u85CF").setDesc("\u628A\u7A97\u53E3\u62D6\u5230\u5C4F\u5E55\u4EFB\u610F\u4E00\u6761\u8FB9\u540E\u81EA\u52A8\u6536\u8D77\uFF0C\u53EA\u5728\u8FB9\u7F18\u7559\u4E00\u6761\u5F88\u7A84\u7684\u89E6\u53D1\u6761\uFF1B\u9F20\u6807\u79FB\u5165\u65F6\u6ED1\u51FA\uFF0C\u79FB\u51FA\u540E\u6536\u56DE\u3002").addToggle(i=>i.setValue(this.plugin.settings.snapAutoHide).onChange(async n=>{this.plugin.settings.snapAutoHide=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new h.Setting(t).setName("\u7A97\u53E3\u4E0D\u900F\u660E\u5EA6").setDesc("\u65B9\u4FBF\u5728\u5C0F\u90E8\u4EF6\u4E0B\u7EE7\u7EED\u64CD\u4F5C\u5176\u4ED6\u5E94\u7528\u3002").addSlider(i=>i.setLimits(.4,1,.05).setValue(this.plugin.settings.opacity).setDynamicTooltip().onChange(async n=>{this.plugin.settings.opacity=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new h.Setting(t).setName("\u5185\u5BB9\u7F29\u653E").addSlider(i=>i.setLimits(.7,1.6,.05).setValue(this.plugin.settings.zoom).setDynamicTooltip().onChange(async n=>{this.plugin.settings.zoom=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new h.Setting(t).setName("\u7A97\u53E3\u5BBD\u5EA6").addSlider(i=>i.setLimits(240,800,10).setValue(this.plugin.settings.width).setDynamicTooltip().onChange(async n=>{this.plugin.settings.width=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new h.Setting(t).setName("\u7A97\u53E3\u9AD8\u5EA6").addSlider(i=>i.setLimits(200,900,10).setValue(this.plugin.settings.height).setDynamicTooltip().onChange(async n=>{this.plugin.settings.height=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new h.Setting(t).setName("\u663E\u793A / \u5173\u95ED\u5C0F\u90E8\u4EF6").setDesc("\u4E5F\u53EF\u4EE5\u7528\u5DE6\u4FA7\u8FB9\u680F\u7684\u9762\u677F\u56FE\u6807\uFF0C\u6216\u5728\u547D\u4EE4\u9762\u677F\u6267\u884C\u300C\u6253\u5F00/\u5173\u95ED\u7B14\u8BB0\u5C0F\u90E8\u4EF6\u300D\u3002").addButton(i=>i.setButtonText("\u6253\u5F00").onClick(async()=>{await this.plugin.widget.open()})).addButton(i=>i.setButtonText("\u5173\u95ED").onClick(async()=>{await this.plugin.widget.close()}))}refreshStatus(){if(!this.statusEl)return;this.statusEl.removeClass("is-warning");let t=this.plugin.getTargetFile();if(t){this.statusEl.setText(`\u5DF2\u5173\u8054\uFF1A${t.path}`);return}this.statusEl.addClass("is-warning"),this.statusEl.setText(this.plugin.settings.notePath?"\u672A\u5728\u5E93\u4E2D\u627E\u5230\u8FD9\u6761\u7B14\u8BB0\uFF0C\u8BF7\u68C0\u67E5\u8DEF\u5F84\uFF08\u9700\u8981\u5305\u542B .md\uFF09\u3002":"\u5C1A\u672A\u9009\u62E9\u76EE\u6807\u7B14\u8BB0\u3002")}};var A=require("obsidian");var F='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>',z='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v5h-5"/></svg>',W='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',V='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',$='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',j=`
:root { --nw-header-height: 26px; }
html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
body.nw-body {
	padding: 0;
	font-family: var(--font-interface, "Segoe UI", system-ui, sans-serif);
	font-size: 13px;
	line-height: 1.5;
	color: var(--text-normal, #dcddde);
	background-color: var(--background-primary, #1e1e1e);
	-webkit-font-smoothing: antialiased;
}
.nw-header {
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	height: var(--nw-header-height);
	padding: 0 4px 0 10px;
	background: var(--background-secondary, rgba(255, 255, 255, 0.04));
	border-bottom: 1px solid var(--background-modifier-border, rgba(255, 255, 255, 0.08));
	-webkit-app-region: drag;
	user-select: none;
}
.nw-title {
	flex: 1 1 auto;
	min-width: 0;
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 0.2px;
	color: var(--text-muted, #9aa0a6);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.nw-btn {
	-webkit-app-region: no-drag;
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 20px;
	margin-left: 1px;
	padding: 0;
	border: none;
	border-radius: 4px;
	background: transparent;
	color: var(--text-muted, #9aa0a6);
	cursor: pointer;
	box-shadow: none !important;
}
.nw-btn:hover { background: var(--background-modifier-hover, rgba(255, 255, 255, 0.08)); color: var(--text-normal, #dcddde); }
.nw-btn.is-active { color: var(--interactive-accent, #7c3aed); }
.nw-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.nw-btn-save { display: none; }
body.nw-mode-edit .nw-btn-save { display: inline-flex; color: var(--interactive-accent, #7c3aed); }
#nw-editor {
	display: none;
	box-sizing: border-box;
	width: 100%;
	height: calc(100% - var(--nw-header-height));
	margin: 0;
	padding: 10px 12px 18px;
	border: none;
	outline: none;
	resize: none;
	background-color: var(--background-primary, #1e1e1e);
	color: var(--text-normal, #dcddde);
	font-family: var(--font-monospace, "Cascadia Mono", Consolas, monospace);
	font-size: 12.5px;
	line-height: 1.65;
	tab-size: 4;
	white-space: pre-wrap;
	overflow-y: auto;
}
body.nw-mode-edit #nw-editor { display: block; }
body.nw-mode-edit #nw-root { display: none; }
.nw-banner {
	position: fixed;
	left: 8px;
	right: 8px;
	bottom: 8px;
	z-index: 10;
	display: none;
	align-items: center;
	gap: 8px;
	box-sizing: border-box;
	padding: 7px 9px;
	border-radius: 6px;
	font-size: 12px;
	line-height: 1.4;
	background: var(--interactive-accent, #7c3aed);
	color: var(--text-on-accent, #ffffff);
	box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
}
.nw-banner.is-visible { display: flex; }
.nw-banner.is-error { background: var(--background-modifier-error, #8b2f2f); }
.nw-banner-msg { flex: 1 1 auto; min-width: 0; }
.nw-banner-actions { flex: 0 0 auto; display: flex; gap: 6px; }
.nw-banner-btn {
	flex: 0 0 auto;
	padding: 2px 7px;
	border: 1px solid rgba(255, 255, 255, 0.45);
	border-radius: 4px;
	background: transparent;
	color: inherit;
	font-size: 11.5px;
	cursor: pointer;
}
.nw-banner-btn:hover { background: rgba(255, 255, 255, 0.16); }
#nw-root {
	box-sizing: border-box;
	height: calc(100% - var(--nw-header-height));
	padding: 4px 14px 18px;
	overflow-x: hidden;
	overflow-y: auto;
	overscroll-behavior: contain;
}
#nw-root.markdown-rendered { font-size: var(--font-text-size, 14px); }
#nw-root::-webkit-scrollbar { width: 8px; }
#nw-root::-webkit-scrollbar-thumb { background-color: var(--scrollbar-thumb-bg, rgba(255, 255, 255, 0.14)); border-radius: 4px; }
#nw-root::-webkit-scrollbar-track { background: transparent; }
#nw-root > *:first-child { margin-top: 2px; }
#nw-root a[data-nw-open], #nw-root a[data-nw-external] { cursor: pointer; }
.nw-empty { padding: 22px 6px; color: var(--text-muted, #9aa0a6); }
.nw-empty-title { margin-bottom: 6px; font-weight: 600; color: var(--text-normal, #dcddde); }
.nw-empty-desc { font-size: 12px; line-height: 1.6; }
/* \u6536\u8D77\u540E\u53EA\u9732\u51FA\u5F88\u7A84\u7684\u4E00\u6761\u89E6\u53D1\u6761\uFF1A\u628A\u6807\u9898\u680F\u6D82\u6210\u5F3A\u8C03\u8272\u4F5C\u4E3A\u63D0\u793A */
body.is-collapsed .nw-title, body.is-collapsed .nw-btn { display: none; }
body.is-collapsed .nw-header { border-bottom: none; background: var(--interactive-accent, #7c3aed); }
body.is-collapsed #nw-root { visibility: hidden; }
`,U=`
(function () {
	var seq = 0;
	var currentLinks = {};
	var editor = document.getElementById('nw-editor');
	var banner = document.getElementById('nw-banner');
	var bannerMsg = document.getElementById('nw-banner-msg');
	var bannerActions = document.getElementById('nw-banner-actions');
	var bannerTimer = null;
	function applyLinks(links) {
		var next = {};
		(links || []).forEach(function (href) { next[href] = true; });
		Object.keys(currentLinks).forEach(function (href) {
			if (next[href]) return;
			var el = currentLinks[href];
			if (el && el.parentNode) el.parentNode.removeChild(el);
			delete currentLinks[href];
		});
		Object.keys(next).forEach(function (href) {
			if (currentLinks[href]) return;
			var el = document.createElement('link');
			el.rel = 'stylesheet';
			el.href = href;
			// \u4E3B\u9898/\u6838\u5FC3\u6837\u5F0F\u653E\u5728\u5185\u8054\u6837\u5F0F\u4E4B\u524D\uFF0C\u4FDD\u8BC1\u5C0F\u90E8\u4EF6\u81EA\u8EAB\u7684\u5916\u58F3\u89C4\u5219\u53EF\u4EE5\u8986\u76D6
			document.head.insertBefore(el, document.head.firstChild);
			currentLinks[href] = el;
		});
	}
	function send(kind, payload) {
		seq += 1;
		document.title = 'nw-action:' + kind + ':' + seq + ':' + encodeURIComponent(payload == null ? '' : String(payload));
	}
	function syncEditing(on) {
		document.body.classList.toggle('nw-mode-edit', !!on);
		var btn = document.querySelector('[data-nw-action="edit"]');
		if (btn) btn.classList.toggle('is-active', !!on);
	}
	window.__nwHideBanner = function () {
		if (bannerTimer) { clearTimeout(bannerTimer); bannerTimer = null; }
		if (!banner) return;
		banner.className = 'nw-banner';
		if (bannerActions) bannerActions.innerHTML = '';
	};
	window.__nwBanner = function (msg, kind, buttons) {
		if (!banner) return;
		window.__nwHideBanner();
		banner.className = 'nw-banner is-visible' + (kind ? ' is-' + kind : '');
		if (bannerMsg) bannerMsg.textContent = msg || '';
		(buttons || []).forEach(function (item) {
			var btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'nw-banner-btn';
			btn.textContent = item.label;
			btn.addEventListener('click', function () {
				window.__nwHideBanner();
				send(item.action, item.payload || '');
			});
			bannerActions.appendChild(btn);
		});
		if (kind !== 'error') {
			bannerTimer = setTimeout(window.__nwHideBanner, 2200);
		}
	};
	window.__nwSetEditing = function (on) {
		syncEditing(on);
		if (!on) window.__nwHideBanner();
	};
	window.__nwSetSource = function (text) {
		if (!editor) return;
		editor.value = typeof text === 'string' ? text : '';
		editor.scrollTop = 0;
	};
	window.__nwGetSource = function () {
		return editor ? editor.value : '';
	};
	function handleShortcut(ev) {
		if ((ev.ctrlKey || ev.metaKey) && (ev.key === 's' || ev.key === 'S')) {
			if (!document.body.classList.contains('nw-mode-edit')) return;
			ev.preventDefault();
			send('save', '');
			return;
		}
		if (ev.key === 'Escape' && document.body.classList.contains('nw-mode-edit')) {
			ev.preventDefault();
			send('cancel', '');
		}
	}
	if (editor) editor.addEventListener('keydown', handleShortcut);
	document.addEventListener('keydown', handleShortcut, true);
	document.addEventListener('click', function (ev) {
		var node = ev.target;
		if (!node || typeof node.closest !== 'function') return;
		var actionEl = node.closest('[data-nw-action]');
		if (actionEl) {
			ev.preventDefault();
			ev.stopPropagation();
			var action = actionEl.getAttribute('data-nw-action');
			if (action === 'edit') {
				action = document.body.classList.contains('nw-mode-edit') ? 'cancel' : 'edit';
			}
			send(action, '');
			return;
		}
		var link = node.closest('a');
		if (!link) return;
		if (link.hasAttribute('data-nw-open')) {
			ev.preventDefault();
			send('open', link.getAttribute('data-nw-open'));
			return;
		}
		if (link.hasAttribute('data-nw-external')) {
			ev.preventDefault();
			send('external', link.getAttribute('data-nw-external'));
			return;
		}
		var href = link.getAttribute('href') || '';
		if (href.charAt(0) === '#') return;
		if (href) ev.preventDefault();
	}, true);
	document.addEventListener('auxclick', function (ev) { ev.preventDefault(); }, true);
	window.__nwUpdate = function (p) {
		applyLinks(p.links);
		if (p.css !== null && p.css !== undefined) {
			document.getElementById('nw-app-css').textContent = p.css;
		}
		if ((p.htmlStyle || '') !== (document.documentElement.getAttribute('style') || '')) {
			document.documentElement.setAttribute('style', p.htmlStyle || '');
		}
		if ((p.bodyStyle || '') !== (document.body.getAttribute('style') || '')) {
			document.body.setAttribute('style', p.bodyStyle || '');
		}
		var collapsed = document.body.classList.contains('is-collapsed');
		var editing = document.body.classList.contains('nw-mode-edit');
		var edge = document.body.getAttribute('data-nw-edge');
		var theme = p.theme === 'theme-light' ? 'theme-light' : 'theme-dark';
		document.documentElement.className = theme;
		document.body.className = 'nw-body ' + theme;
		if (editing) document.body.classList.add('nw-mode-edit');
		if (collapsed) {
			document.body.classList.add('is-collapsed');
			if (edge) document.body.setAttribute('data-nw-edge', edge);
		}
		document.getElementById('nw-title').textContent = p.title || '\u7B14\u8BB0\u5C0F\u90E8\u4EF6';
		var pin = document.querySelector('[data-nw-action="pin"]');
		if (pin) pin.classList.toggle('is-active', !!p.pinned);
		document.getElementById('nw-root').innerHTML = p.html || '';
		document.getElementById('nw-root').scrollTop = 0;
	};
	window.__nwSetCollapsed = function (collapsed, edge) {
		document.body.classList.toggle('is-collapsed', !!collapsed);
		if (collapsed) document.body.setAttribute('data-nw-edge', edge || '');
		else document.body.removeAttribute('data-nw-edge');
	};
})();
`;function E(){return`<!DOCTYPE html>
<html class="theme-dark">
<head>
<meta charset="utf-8" />
<style id="nw-app-css"></style>
<style id="nw-chrome-css">${j}</style>
</head>
<body class="nw-body theme-dark">
<header class="nw-header">
	<span class="nw-title" id="nw-title">\u7B14\u8BB0\u5C0F\u90E8\u4EF6</span>
	<button class="nw-btn" type="button" data-nw-action="edit" title="\u5207\u6362\u7F16\u8F91/\u9884\u89C8">${V}</button>
	<button class="nw-btn nw-btn-save" type="button" data-nw-action="save" title="\u4FDD\u5B58\uFF08Ctrl+S\uFF09">${$}</button>
	<button class="nw-btn" type="button" data-nw-action="pin" title="\u59CB\u7EC8\u7F6E\u9876">${F}</button>
	<button class="nw-btn" type="button" data-nw-action="refresh" title="\u5237\u65B0">${z}</button>
	<button class="nw-btn" type="button" data-nw-action="close" title="\u5173\u95ED\u5C0F\u90E8\u4EF6">${W}</button>
</header>
<main id="nw-root" class="markdown-preview-view markdown-rendered"></main>
<textarea id="nw-editor" spellcheck="false" placeholder="Markdown \u6E90\u7801"></textarea>
<div id="nw-banner" class="nw-banner"><span class="nw-banner-msg" id="nw-banner-msg"></span><span class="nw-banner-actions" id="nw-banner-actions"></span></div>
<script>${U}<\/script>
</body>
</html>`}var g=6,q=16,J=120,G=4,C="nw-action:",_="\u7B14\u8BB0\u5C0F\u90E8\u4EF6";function P(){try{return require("electron")}catch(d){return null}}function m(){let d=P();if(!d)return null;if(d.remote)return d.remote;try{return require("@electron/remote")}catch(e){return null}}function u(d,e,t){return t<e&&(t=e),Math.max(e,Math.min(t,d))}function K(d){return d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var f=class{constructor(e){this.plugin=e;this.win=null;this.renderHost=null;this.cssCache=null;this.injectedCss=null;this.injectedLinks=[];this.renderToken=0;this.renderTimer=null;this.moveTimer=null;this.resizeTimer=null;this.hoverTimer=null;this.animTimer=null;this.suppressUntil=0;this.snapEdge=null;this.hidden=!1;this.revealArmed=!1;this.busy=!1;this.outsideTicks=0;this.preserveVisibleState=!1;this.editing=!1;this.editBaseline=null;this.plugin.registerEvent(this.plugin.app.workspace.on("css-change",()=>{this.cssCache=null,this.scheduleRender(120)}))}isOpen(){return!!this.win&&!this.win.isDestroyed()}async toggle(){this.isOpen()?await this.close():await this.open()}async open(){if(this.isOpen()){this.win.show(),this.win.focus();return}let e=m();if(!e||!e.BrowserWindow){console.error("[note-widget] \u65E0\u6CD5\u83B7\u53D6 Electron \u7684 BrowserWindow\uFF0C\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u72EC\u7ACB\u7A97\u53E3");return}let t=this.plugin.settings,i=this.initialBounds(),n=new e.BrowserWindow({x:i.x,y:i.y,width:i.width,height:i.height,frame:!1,transparent:!1,resizable:!0,movable:!0,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!1,alwaysOnTop:t.alwaysOnTop,backgroundColor:this.themeBackground(),title:_,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!1,webSecurity:!1,spellcheck:!1,backgroundThrottling:!1}});this.win=n,this.registerWindowEvents(n);try{await n.loadURL("data:text/html;charset=utf-8,"+encodeURIComponent(E()))}catch(s){console.error("[note-widget] \u5C0F\u90E8\u4EF6\u7A97\u53E3\u52A0\u8F7D\u5931\u8D25",s)}this.isOpen()&&(this.applySettings(),n.show(),t.widgetVisible=!0,await this.plugin.saveSettings(),await this.render(),this.restoreSnappedState())}async close(){let e=this.win;e&&!e.isDestroyed()?e.destroy():this.handleClosed()}destroy(e=!1){this.preserveVisibleState=e;let t=this.win;t&&!t.isDestroyed()?t.destroy():this.handleClosed()}applySettings(){let e=this.win;if(!e||e.isDestroyed())return;let t=this.plugin.settings;e.setAlwaysOnTop(t.alwaysOnTop,"floating"),e.setOpacity(u(t.opacity,.3,1));try{e.webContents.setZoomFactor(u(t.zoom,.6,2))}catch(a){}let i=e.getBounds(),n=u(Math.round(t.width),220,1600),s=u(Math.round(t.height),180,1600);(Math.abs(i.width-n)>4||Math.abs(i.height-s)>4)&&e.setSize(n,s),this.exec(`(function(){var b=document.querySelector('[data-nw-action="pin"]');if(b)b.classList.toggle('is-active',${t.alwaysOnTop?"true":"false"});})()`),t.snapAutoHide||(this.stopHoverWatch(),this.snapEdge=null,this.hidden&&(this.hidden=!1,this.exec("window.__nwSetCollapsed && window.__nwSetCollapsed(false)")))}scheduleRender(e=250){this.renderTimer&&window.clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>{this.renderTimer=null,this.render()},e)}async render(){var r,o;let e=this.win;if(!e||e.isDestroyed())return;let t=++this.renderToken,i=this.plugin.getTargetFile(),n,s;if(i?(s=i.basename,n=await this.renderNoteHtml(i)):(s="\u7B14\u8BB0\u5C0F\u90E8\u4EF6",n='<div class="nw-empty"><div class="nw-empty-title">\u672A\u9009\u62E9\u7B14\u8BB0</div><div class="nw-empty-desc">\u6253\u5F00\u300C\u8BBE\u7F6E \u2192 \u7B14\u8BB0\u5C0F\u90E8\u4EF6\u300D\uFF0C\u586B\u5165\u7B14\u8BB0\u8DEF\u5F84\u6216\u70B9\u51FB\u300C\u9009\u62E9\u300D\u4ECE\u5E93\u4E2D\u6311\u4E00\u6761\u7B14\u8BB0\u3002</div></div>'),t!==this.renderToken||!this.isOpen())return;let a={title:s,html:n,theme:this.themeClass(),pinned:this.plugin.settings.alwaysOnTop,css:this.cssForInjection(),links:this.linksForInjection(),htmlStyle:(r=document.documentElement.getAttribute("style"))!=null?r:"",bodyStyle:(o=document.body.getAttribute("style"))!=null?o:""};try{await e.webContents.executeJavaScript(`window.__nwUpdate && window.__nwUpdate(${JSON.stringify(a)})`,!0)}catch(c){}}registerWindowEvents(e){e.on("move",()=>this.onMove()),e.on("resize",()=>this.onResize()),e.on("closed",()=>this.handleClosed());let t=e.webContents;if(t.on("page-title-updated",(i,n)=>{i.preventDefault(),this.onActionMessage(n),e.isDestroyed()||e.setTitle(_)}),t.on("will-navigate",(i,n)=>{i.preventDefault(),this.handleNavigatedUrl(n)}),typeof t.setWindowOpenHandler=="function")try{t.setWindowOpenHandler(()=>({action:"deny"}))}catch(i){}}handleClosed(){this.win=null,this.clearTimers(),this.injectedCss=null,this.snapEdge=null,this.hidden=!1,this.revealArmed=!1,this.busy=!1,this.editing=!1,this.editBaseline=null,this.cleanupHost(),this.preserveVisibleState||(this.plugin.settings.widgetVisible=!1,this.plugin.saveSettings()),this.preserveVisibleState=!1}onActionMessage(e){if(typeof e!="string"||!e.startsWith(C))return;let t=e.slice(C.length),i=t.indexOf(":");if(i<0)return;let n=t.slice(0,i),s=t.slice(i+1),a=s.indexOf(":");if(a<0)return;let r=s.slice(a+1);try{r=decodeURIComponent(r)}catch(o){}this.handleAction(n,r)}async handleAction(e,t){switch(e){case"pin":await this.setPinned(!this.plugin.settings.alwaysOnTop);break;case"refresh":await this.render();break;case"close":await this.close();break;case"open":t&&await this.plugin.app.workspace.openLinkText(t,"",!1);break;case"external":this.openExternal(t);break;case"edit":await this.beginEdit();break;case"cancel":case"view":await this.exitEdit();break;case"save":await this.saveDraft(!1);break;case"force-save":await this.saveDraft(!0);break;case"reload":await this.reloadSource();break}}handleNavigatedUrl(e){var i,n;let t;try{t=new URL(e)}catch(s){return}if(t.protocol==="notewidget:"){let s=t.host||t.pathname.replace(/^\/+/,""),a=(n=(i=t.searchParams.get("file"))!=null?i:t.searchParams.get("url"))!=null?n:"";this.handleAction(s,a);return}(t.protocol==="http:"||t.protocol==="https:"||t.protocol==="mailto:")&&this.openExternal(e)}openExternal(e){var i;if(!e)return;try{let n=new URL(e);if(!["http:","https:","mailto:"].includes(n.protocol))return}catch(n){return}let t=P();(i=t==null?void 0:t.shell)!=null&&i.openExternal?t.shell.openExternal(e):window.open(e)}async setPinned(e){this.plugin.settings.alwaysOnTop=e,this.isOpen()&&this.win.setAlwaysOnTop(e,"floating"),await this.plugin.saveSettings(),await this.exec(`(function(){var b=document.querySelector('[data-nw-action="pin"]');if(b)b.classList.toggle('is-active',${e?"true":"false"});})()`)}async banner(e,t="info",i=[]){await this.exec(`window.__nwBanner && window.__nwBanner(${JSON.stringify(e)}, ${JSON.stringify(t)}, ${JSON.stringify(i)})`)}async beginEdit(){let e=this.plugin.getTargetFile();if(!e){await this.banner("\u672A\u627E\u5230\u76EE\u6807\u7B14\u8BB0\uFF0C\u8BF7\u5148\u5728\u8BBE\u7F6E\u4E2D\u9009\u62E9","error");return}let t;try{t=await this.plugin.app.vault.read(e)}catch(i){await this.banner("\u8BFB\u53D6\u7B14\u8BB0\u5931\u8D25","error");return}this.editing=!0,this.editBaseline=t,await this.exec(`window.__nwSetSource && window.__nwSetSource(${JSON.stringify(t)})`),await this.exec("window.__nwSetEditing && window.__nwSetEditing(true)"),await this.exec("(function(){var e=document.getElementById('nw-editor');if(e)e.focus();})()")}async exitEdit(){this.editing=!1,this.editBaseline=null,await this.exec("window.__nwSetEditing && window.__nwSetEditing(false)"),await this.render()}async reloadSource(){let e=this.plugin.getTargetFile();if(!e){await this.banner("\u672A\u627E\u5230\u76EE\u6807\u7B14\u8BB0","error");return}let t;try{t=await this.plugin.app.vault.read(e)}catch(i){await this.banner("\u8BFB\u53D6\u7B14\u8BB0\u5931\u8D25","error");return}this.editing=!0,this.editBaseline=t,await this.exec(`window.__nwSetSource && window.__nwSetSource(${JSON.stringify(t)})`),await this.exec("window.__nwSetEditing && window.__nwSetEditing(true)"),await this.banner("\u5DF2\u91CD\u65B0\u8F7D\u5165\u7B14\u8BB0\u539F\u6587")}async saveDraft(e){if(!this.editing)return;let t=this.plugin.getTargetFile();if(!t){await this.banner("\u672A\u627E\u5230\u76EE\u6807\u7B14\u8BB0","error");return}let i=await this.execValue("window.__nwGetSource ? window.__nwGetSource() : null");if(typeof i!="string"){await this.banner("\u8BFB\u53D6\u7F16\u8F91\u5185\u5BB9\u5931\u8D25","error");return}if(i===this.editBaseline){await this.exitEdit(),await this.banner("\u6CA1\u6709\u9700\u8981\u4FDD\u5B58\u7684\u6539\u52A8");return}let n;try{n=await this.plugin.app.vault.read(t)}catch(s){await this.banner("\u8BFB\u53D6\u7B14\u8BB0\u5931\u8D25","error");return}if(!e&&this.editBaseline!==null&&n!==this.editBaseline&&n!==i){await this.banner("\u7B14\u8BB0\u5DF2\u5728\u5176\u4ED6\u7A97\u53E3\u88AB\u4FEE\u6539\uFF0C\u672A\u4FDD\u5B58\u4EE5\u514D\u8986\u76D6","error",[{label:"\u91CD\u65B0\u8F7D\u5165",action:"reload"},{label:"\u4ECD\u7136\u8986\u76D6",action:"force-save"}]);return}this.editBaseline=i;try{await this.plugin.app.vault.modify(t,i)}catch(s){await this.banner("\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6587\u4EF6\u6743\u9650","error");return}this.editing=!1,this.editBaseline=null,await this.exec("window.__nwSetEditing && window.__nwSetEditing(false)"),await this.render(),await this.banner("\u5DF2\u4FDD\u5B58")}async handleVaultChange(){if(!this.editing){this.scheduleRender();return}let e=this.plugin.getTargetFile();if(!e||this.editBaseline===null)return;let t;try{t=await this.plugin.app.vault.read(e)}catch(i){return}t!==this.editBaseline&&await this.banner("\u7B14\u8BB0\u5DF2\u5728\u5176\u4ED6\u7A97\u53E3\u88AB\u4FEE\u6539\uFF0C\u4F60\u7684\u8349\u7A3F\u5C1A\u672A\u4FDD\u5B58","error",[{label:"\u91CD\u65B0\u8F7D\u5165",action:"reload"},{label:"\u4ECD\u7136\u8986\u76D6",action:"force-save"}])}async handleTargetChanged(){this.editing&&(this.editing=!1,this.editBaseline=null,await this.exec("window.__nwSetEditing && window.__nwSetEditing(false)"),await this.banner("\u76EE\u6807\u7B14\u8BB0\u5DF2\u53D8\u66F4\uFF0C\u5DF2\u9000\u51FA\u7F16\u8F91")),await this.render()}async renderNoteHtml(e){let t=this.plugin.app,i=this.getRenderHost();i.empty();let n=this.isOpen()?this.win.getBounds().width:this.plugin.settings.width;i.style.width=`${Math.max(200,n-28)}px`;try{let s=await t.vault.cachedRead(e);return await A.MarkdownRenderer.render(t,s,i,e.path,this.plugin),await new Promise(a=>window.setTimeout(a,80)),this.rewriteLinks(i,e),i.innerHTML}catch(s){let a=s instanceof Error?s.message:String(s);return`<div class="nw-empty"><div class="nw-empty-title">\u6E32\u67D3\u5931\u8D25</div><div class="nw-empty-desc">${K(a)}</div></div>`}finally{i.empty()}}rewriteLinks(e,t){e.querySelectorAll("a").forEach(i=>{var a,r;let n=(a=i.getAttribute("href"))!=null?a:"",s=(r=i.getAttribute("data-href"))!=null?r:n;if(i.classList.contains("internal-link")||i.hasAttribute("data-href")){let o=this.plugin.app.metadataCache.getFirstLinkpathDest(s,t.path);o&&i.setAttribute("data-nw-open",o.path),i.removeAttribute("href");return}if(/^javascript:/i.test(n)){i.removeAttribute("href");return}(/^(https?:|mailto:)/i.test(n)||i.classList.contains("external-link"))&&n&&i.setAttribute("data-nw-external",n)})}getRenderHost(){return(!this.renderHost||!this.renderHost.isConnected)&&(this.renderHost=document.body.createDiv({cls:"note-widget-render-host"})),this.renderHost}cleanupHost(){var e;(e=this.renderHost)!=null&&e.isConnected&&this.renderHost.remove(),this.renderHost=null}collectStyles(){let e=[];document.querySelectorAll("style").forEach(i=>{let n=i.textContent;n&&n.trim()&&e.push(n)});let t=[];return document.querySelectorAll('link[rel="stylesheet"]').forEach(i=>{let n=i.href;n&&t.push(n)}),{css:e.join(`
`),links:t}}cssForInjection(){return this.cssCache===null&&(this.cssCache=this.collectStyles()),this.cssCache.css===this.injectedCss?null:(this.injectedCss=this.cssCache.css,this.cssCache.css)}linksForInjection(){this.cssCache===null&&(this.cssCache=this.collectStyles());let e=this.cssCache.links;return e.length===this.injectedLinks.length&&e.every((t,i)=>t===this.injectedLinks[i])?this.injectedLinks:(this.injectedLinks=e,e)}themeClass(){return document.body.classList.contains("theme-light")?"theme-light":"theme-dark"}themeBackground(){let e=getComputedStyle(document.body).backgroundColor;return e&&e!=="rgba(0, 0, 0, 0)"&&e!=="transparent"?e:"#1e1e1e"}initialBounds(){let e=this.plugin.settings,t=u(Math.round(e.width),220,1600),i=u(Math.round(e.height),180,1600),n=m(),s=n==null?void 0:n.screen;if(e.x===null||e.y===null){let o=s?s.getPrimaryDisplay().workArea:{x:0,y:0,width:window.screen.availWidth,height:window.screen.availHeight};return{x:o.x+o.width-t-24,y:o.y+o.height-i-24,width:t,height:i}}let a=e.x,r=e.y;if(s){let c=s.getDisplayNearestPoint({x:a,y:r}).workArea;a=u(a,c.x,c.x+c.width-t),r=u(r,c.y,c.y+c.height-i)}return{x:a,y:r,width:t,height:i}}onMove(){this.isOpen()&&(this.hidden||this.busy||Date.now()<this.suppressUntil||(this.moveTimer&&window.clearTimeout(this.moveTimer),this.moveTimer=window.setTimeout(()=>{this.moveTimer=null,this.afterUserMove()},300)))}async afterUserMove(){if(!this.isOpen()||this.hidden||(this.savePosition(),!this.plugin.settings.snapAutoHide))return;let e=this.detectEdge();e&&await this.collapseToEdge(e)}onResize(){this.isOpen()&&(Date.now()<this.suppressUntil||(this.resizeTimer&&window.clearTimeout(this.resizeTimer),this.resizeTimer=window.setTimeout(()=>{if(this.resizeTimer=null,!this.isOpen())return;let e=this.win.getBounds(),t=this.plugin.settings;Math.abs(e.width-t.width)<=4&&Math.abs(e.height-t.height)<=4||(t.width=e.width,t.height=e.height,this.plugin.saveSettings(),this.scheduleRender(180))},300)))}savePosition(){if(!this.isOpen())return;let e=this.win.getBounds(),t=this.plugin.settings;t.x===e.x&&t.y===e.y||(t.x=e.x,t.y=e.y,this.plugin.saveSettings())}restoreSnappedState(){if(!this.isOpen()||!this.plugin.settings.snapAutoHide)return;let e=this.detectEdge();e&&(this.snapEdge=e,this.hidden=!1,this.revealArmed=!0,this.startHoverWatch())}detectEdge(){if(!this.isOpen())return null;let e=this.win.getBounds(),t=this.workArea(e),i={left:Math.abs(e.x-t.x),right:Math.abs(t.x+t.width-(e.x+e.width)),top:Math.abs(e.y-t.y),bottom:Math.abs(t.y+t.height-(e.y+e.height))},n=null,s=q+1;return["left","right","top","bottom"].forEach(a=>{i[a]<s&&(s=i[a],n=a)}),n}workArea(e){let t=m(),i=t==null?void 0:t.screen;if(i!=null&&i.getDisplayMatching){let n=i.getDisplayMatching(e),s=n==null?void 0:n.workArea;if(s&&[s.x,s.y,s.width,s.height].every(a=>Number.isFinite(a)))return s}return{x:0,y:0,width:window.screen.availWidth,height:window.screen.availHeight}}flushBounds(e,t,i){switch(e){case"left":return{x:i.x,y:t.y};case"right":return{x:i.x+i.width-t.width,y:t.y};case"top":return{x:t.x,y:i.y};case"bottom":return{x:t.x,y:i.y+i.height-t.height}}return{x:t.x,y:t.y}}hiddenPosition(e,t,i){switch(e){case"left":return{x:i.x-t.width+g,y:t.y};case"right":return{x:i.x+i.width-g,y:t.y};case"top":return{x:t.x,y:i.y-t.height+g};case"bottom":return{x:t.x,y:i.y+i.height-g}}return{x:t.x,y:t.y}}async collapseToEdge(e){if(!(!this.isOpen()||this.busy)){this.busy=!0;try{let t=this.win.getBounds(),i=this.workArea(t);this.snapEdge=e;let n=this.flushBounds(e,t,i);await this.animateTo(n,120),this.plugin.settings.x=n.x,this.plugin.settings.y=n.y,this.plugin.saveSettings();let s=this.hiddenPosition(e,t,i);await this.animateTo(s,170),this.hidden=!0,this.revealArmed=!1,await this.exec(`window.__nwSetCollapsed && window.__nwSetCollapsed(true, '${e}')`),this.startHoverWatch()}finally{this.busy=!1}}}async expand(){if(!(!this.isOpen()||this.busy||!this.snapEdge)){this.busy=!0;try{await this.exec("window.__nwSetCollapsed && window.__nwSetCollapsed(false)");let e=this.win.getBounds(),t=this.workArea(e),i=this.flushBounds(this.snapEdge,e,t);this.hidden=!1,this.outsideTicks=0,this.revealArmed=!0,await this.animateTo(i,150)}finally{this.busy=!1}}}async collapseAgain(){if(!(!this.isOpen()||this.busy||!this.snapEdge)){this.busy=!0;try{let e=this.win.getBounds(),t=this.workArea(e),i=this.hiddenPosition(this.snapEdge,e,t);await this.animateTo(i,170),this.hidden=!0,this.revealArmed=!1,await this.exec(`window.__nwSetCollapsed && window.__nwSetCollapsed(true, '${this.snapEdge}')`)}finally{this.busy=!1}}}startHoverWatch(){this.hoverTimer||(this.outsideTicks=0,this.hoverTimer=window.setInterval(()=>this.hoverTick(),J))}stopHoverWatch(){this.hoverTimer&&(window.clearInterval(this.hoverTimer),this.hoverTimer=null),this.outsideTicks=0}hoverTick(){if(!this.isOpen()){this.stopHoverWatch();return}if(!this.plugin.settings.snapAutoHide||!this.snapEdge){this.stopHoverWatch();return}if(this.busy)return;let e=this.cursorPoint();if(e){if(this.hidden){let t=this.pointInRect(e,this.triggerRect(this.snapEdge));if(!this.revealArmed){t||(this.revealArmed=!0);return}t&&this.expand();return}if(this.pointInRect(e,this.inflateRect(this.win.getBounds(),10))){this.outsideTicks=0;return}this.outsideTicks+=1,this.outsideTicks>=G&&(this.outsideTicks=0,this.collapseAgain())}}triggerRect(e){let t=this.win.getBounds(),i=this.workArea(t),n=g+6;switch(e){case"left":return{x:i.x,y:t.y,width:n,height:t.height};case"right":return{x:i.x+i.width-n,y:t.y,width:n,height:t.height};case"top":return{x:t.x,y:i.y,width:t.width,height:n};case"bottom":return{x:t.x,y:i.y+i.height-n,width:t.width,height:n}}}inflateRect(e,t){return{x:e.x-t,y:e.y-t,width:e.width+t*2,height:e.height+t*2}}pointInRect(e,t){return e.x>=t.x&&e.x<=t.x+t.width&&e.y>=t.y&&e.y<=t.y+t.height}cursorPoint(){var i;let e=(i=m())==null?void 0:i.screen;if(!(e!=null&&e.getCursorScreenPoint))return null;let t=e.getCursorScreenPoint();return{x:t.x,y:t.y}}async animateTo(e,t){let i=this.win;if(!i||i.isDestroyed())return;if(!e||!Number.isFinite(e.x)||!Number.isFinite(e.y)){console.warn("[note-widget] \u5FFD\u7565\u65E0\u6548\u7684\u7A97\u53E3\u4F4D\u7F6E",e);return}this.animTimer&&(window.clearTimeout(this.animTimer),this.animTimer=null);let n=0,s=0;try{let l=i.getPosition();n=Number(l==null?void 0:l[0]),s=Number(l==null?void 0:l[1])}catch(l){return}if(!Number.isFinite(n)||!Number.isFinite(s))return;let a=this.plugin.settings,r=u(Math.round(a.width),220,1600),o=u(Math.round(a.height),180,1600);if(!Number.isFinite(r)||!Number.isFinite(o))try{let l=i.getBounds();r=l.width,o=l.height}catch(l){return}if(!Number.isFinite(r)||!Number.isFinite(o)||r<=0||o<=0||Math.abs(n-e.x)<1&&Math.abs(s-e.y)<1)return;this.suppressUntil=Date.now()+t+600;let c=Date.now();await new Promise(l=>{let x=()=>{if(this.animTimer=null,!this.isOpen()){l();return}let T=Math.min(1,(Date.now()-c)/t),k=1-Math.pow(1-T,3),L=Math.round(n+(e.x-n)*k),B=Math.round(s+(e.y-s)*k);try{this.win.setBounds({x:L,y:B,width:r,height:o},!1)}catch(O){console.warn("[note-widget] \u79FB\u52A8\u7A97\u53E3\u5931\u8D25",O),l();return}T<1?this.animTimer=window.setTimeout(x,16):l()};x()})}clearTimers(){this.renderTimer&&window.clearTimeout(this.renderTimer),this.moveTimer&&window.clearTimeout(this.moveTimer),this.resizeTimer&&window.clearTimeout(this.resizeTimer),this.animTimer&&window.clearTimeout(this.animTimer),this.renderTimer=null,this.moveTimer=null,this.resizeTimer=null,this.animTimer=null,this.stopHoverWatch()}async exec(e){if(this.isOpen())try{await this.win.webContents.executeJavaScript(e,!0)}catch(t){}}async execValue(e){if(!this.isOpen())return null;try{return await this.win.webContents.executeJavaScript(e,!0)}catch(t){return null}}};var v=class extends p.Plugin{async onload(){await this.loadSettings(),this.widget=new f(this),this.addRibbonIcon("panel-top","\u6253\u5F00/\u5173\u95ED\u7B14\u8BB0\u5C0F\u90E8\u4EF6",()=>void this.widget.toggle()),this.addCommand({id:"toggle-note-widget",name:"\u6253\u5F00/\u5173\u95ED\u7B14\u8BB0\u5C0F\u90E8\u4EF6",callback:()=>void this.widget.toggle()}),this.addCommand({id:"refresh-note-widget",name:"\u5237\u65B0\u7B14\u8BB0\u5C0F\u90E8\u4EF6",callback:()=>void this.widget.render()}),this.addSettingTab(new w(this.app,this)),this.registerEvent(this.app.vault.on("modify",e=>{var t;e instanceof p.TFile&&e.path===((t=this.getTargetFile())==null?void 0:t.path)&&this.widget.handleVaultChange()})),this.registerEvent(this.app.vault.on("rename",(e,t)=>{t!==this.settings.notePath||!(e instanceof p.TFile)||(this.settings.notePath=e.path,this.saveSettings(),this.widget.scheduleRender())})),this.registerEvent(this.app.vault.on("delete",e=>{e.path===this.settings.notePath&&this.widget.handleTargetChanged()})),this.app.workspace.onLayoutReady(()=>{this.settings.widgetVisible&&this.widget.open()})}onunload(){var e;(e=this.widget)==null||e.destroy(!0)}async loadSettings(){this.settings=Object.assign({},S,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}applySettings(){var e;(e=this.widget)==null||e.applySettings()}getTargetFile(){var a,r;let e=((a=this.settings.notePath)!=null?a:"").trim();if(!e)return null;let t=e.replace(/^\/+/,""),i=t.toLowerCase().endsWith(".md")?[t]:[t,`${t}.md`];for(let o of i){let c=this.app.vault.getAbstractFileByPath(o);if(c instanceof p.TFile)return c}let n=this.app.metadataCache.getFirstLinkpathDest(t,"");if(n)return n;let s=t.toLowerCase();return(r=this.app.vault.getMarkdownFiles().find(o=>o.path.toLowerCase()===s||o.basename.toLowerCase()===s))!=null?r:null}};
