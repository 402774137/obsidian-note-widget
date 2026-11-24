/*
Obsidian Note Widget
*/
"use strict";var x=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var M=Object.getOwnPropertyNames;var _=Object.prototype.hasOwnProperty;var F=(c,t)=>{for(var e in t)x(c,e,{get:t[e],enumerable:!0})},B=(c,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of M(t))!_.call(c,n)&&n!==e&&x(c,n,{get:()=>t[n],enumerable:!(i=R(t,n))||i.enumerable});return c};var H=c=>B(x({},"__esModule",{value:!0}),c);var Q={};F(Q,{default:()=>k});module.exports=H(Q);var m=require("obsidian");var p=require("obsidian"),E={notePath:"",alwaysOnTop:!0,snapAutoHide:!0,opacity:1,zoom:1,width:360,height:480,x:null,y:null,widgetVisible:!1},T=class extends p.FuzzySuggestModal{constructor(e,i){super(e);this.onPick=i;this.setPlaceholder("\u641C\u7D22\u5E93\u4E2D\u7684\u7B14\u8BB0\u2026")}getItems(){return this.app.vault.getMarkdownFiles()}getItemText(e){return e.path}onChooseItem(e){this.onPick(e)}},b=class extends p.PluginSettingTab{constructor(e,i){super(e,i);this.plugin=i;this.statusEl=null;this.pathText=null}display(){let{containerEl:e}=this;e.empty(),e.addClass("note-widget-settings"),e.createEl("h2",{text:"\u7B14\u8BB0\u5C0F\u90E8\u4EF6"}),e.createEl("p",{cls:"setting-item-description",text:"\u5C0F\u90E8\u4EF6\u662F\u4E00\u4E2A\u72EC\u7ACB\u4E8E Obsidian \u4E3B\u7A97\u53E3\u7684\u65E0\u8FB9\u6846\u684C\u9762\u7A97\u53E3\uFF08\u4EC5\u684C\u9762\u7AEF\u53EF\u7528\uFF09\u3002\u62D6\u52A8\u6807\u9898\u680F\u53EF\u79FB\u52A8\u7A97\u53E3\uFF0C\u62D6\u52A8\u7A97\u53E3\u8FB9\u7F18\u53EF\u6539\u53D8\u5927\u5C0F\u3002"}),new p.Setting(e).setName("\u76EE\u6807\u7B14\u8BB0").setDesc("\u586B\u5199\u5E93\u5185\u76F8\u5BF9\u8DEF\u5F84\uFF08\u4F8B\u5982 Notes/\u4ECA\u65E5\u5F85\u529E.md\uFF09\uFF0C\u6216\u70B9\u51FB\u300C\u9009\u62E9\u300D\u4ECE\u5E93\u4E2D\u6311\u9009\u3002").addText(i=>{this.pathText=i,i.setPlaceholder("Notes/\u4ECA\u65E5\u5F85\u529E.md").setValue(this.plugin.settings.notePath).onChange(async n=>{this.plugin.settings.notePath=n.trim(),await this.plugin.saveSettings(),this.plugin.widget.handleTargetChanged(),this.refreshStatus()})}).addButton(i=>{i.setButtonText("\u9009\u62E9").onClick(()=>{new T(this.app,async n=>{var s;this.plugin.settings.notePath=n.path,await this.plugin.saveSettings(),(s=this.pathText)==null||s.setValue(n.path),this.plugin.widget.handleTargetChanged(),this.refreshStatus()}).open()})}),this.statusEl=e.createDiv({cls:"note-widget-status"}),this.refreshStatus(),new p.Setting(e).setName("\u59CB\u7EC8\u7F6E\u9876").setDesc("\u8BA9\u5C0F\u90E8\u4EF6\u59CB\u7EC8\u663E\u793A\u5728\u5176\u4ED6\u7A97\u53E3\u4E4B\u4E0A\uFF0C\u4E5F\u53EF\u4EE5\u5728\u7A97\u53E3\u53F3\u4E0A\u89D2\u7684\u9762\u677F\u6309\u94AE\u91CC\u968F\u65F6\u5207\u6362\u3002").addToggle(i=>i.setValue(this.plugin.settings.alwaysOnTop).onChange(async n=>{this.plugin.settings.alwaysOnTop=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new p.Setting(e).setName("\u8D34\u8FB9\u81EA\u52A8\u9690\u85CF").setDesc("\u628A\u7A97\u53E3\u62D6\u5230\u5C4F\u5E55\u4EFB\u610F\u4E00\u6761\u8FB9\u540E\u81EA\u52A8\u6536\u8D77\uFF0C\u53EA\u5728\u8FB9\u7F18\u7559\u4E00\u6761\u5F88\u7A84\u7684\u89E6\u53D1\u6761\uFF1B\u9F20\u6807\u79FB\u5165\u65F6\u6ED1\u51FA\uFF0C\u79FB\u51FA\u540E\u6536\u56DE\u3002").addToggle(i=>i.setValue(this.plugin.settings.snapAutoHide).onChange(async n=>{this.plugin.settings.snapAutoHide=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new p.Setting(e).setName("\u7A97\u53E3\u4E0D\u900F\u660E\u5EA6").setDesc("\u65B9\u4FBF\u5728\u5C0F\u90E8\u4EF6\u4E0B\u7EE7\u7EED\u64CD\u4F5C\u5176\u4ED6\u5E94\u7528\u3002").addSlider(i=>i.setLimits(.4,1,.05).setValue(this.plugin.settings.opacity).setDynamicTooltip().onChange(async n=>{this.plugin.settings.opacity=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new p.Setting(e).setName("\u5185\u5BB9\u7F29\u653E").addSlider(i=>i.setLimits(.7,1.6,.05).setValue(this.plugin.settings.zoom).setDynamicTooltip().onChange(async n=>{this.plugin.settings.zoom=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new p.Setting(e).setName("\u7A97\u53E3\u5BBD\u5EA6").addSlider(i=>i.setLimits(240,800,10).setValue(this.plugin.settings.width).setDynamicTooltip().onChange(async n=>{this.plugin.settings.width=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new p.Setting(e).setName("\u7A97\u53E3\u9AD8\u5EA6").addSlider(i=>i.setLimits(200,900,10).setValue(this.plugin.settings.height).setDynamicTooltip().onChange(async n=>{this.plugin.settings.height=n,this.plugin.applySettings(),await this.plugin.saveSettings()})),new p.Setting(e).setName("\u663E\u793A / \u5173\u95ED\u5C0F\u90E8\u4EF6").setDesc("\u4E5F\u53EF\u4EE5\u7528\u5DE6\u4FA7\u8FB9\u680F\u7684\u9762\u677F\u56FE\u6807\uFF0C\u6216\u5728\u547D\u4EE4\u9762\u677F\u6267\u884C\u300C\u6253\u5F00/\u5173\u95ED\u7B14\u8BB0\u5C0F\u90E8\u4EF6\u300D\u3002").addButton(i=>i.setButtonText("\u6253\u5F00").onClick(async()=>{await this.plugin.widget.open()})).addButton(i=>i.setButtonText("\u5173\u95ED").onClick(async()=>{await this.plugin.widget.close()}))}refreshStatus(){if(!this.statusEl)return;this.statusEl.removeClass("is-warning");let e=this.plugin.getTargetFile();if(e){this.statusEl.setText(`\u5DF2\u5173\u8054\uFF1A${e.path}`);return}this.statusEl.addClass("is-warning"),this.statusEl.setText(this.plugin.settings.notePath?"\u672A\u5728\u5E93\u4E2D\u627E\u5230\u8FD9\u6761\u7B14\u8BB0\uFF0C\u8BF7\u68C0\u67E5\u8DEF\u5F84\uFF08\u9700\u8981\u5305\u542B .md\uFF09\u3002":"\u5C1A\u672A\u9009\u62E9\u76EE\u6807\u7B14\u8BB0\u3002")}};var g=require("obsidian");var D='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>',z='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v5h-5"/></svg>',V='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',W='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',j='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',$=`
:root { --nw-header-height: 30px; }
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
	width: 26px;
	height: 24px;
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
.nw-btn svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
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
/* \u53EF\u70B9\u51FB\u52FE\u9009\u7684\u4EFB\u52A1\u590D\u9009\u6846 */
#nw-root input[type="checkbox"][data-nw-task] { cursor: pointer; }
/* \u7A97\u53E3\u5185\u7684\u7B14\u8BB0\u9009\u62E9\u9762\u677F\uFF1A\u9650\u5236\u5728\u7A97\u53E3\u5185\u90E8\uFF0C\u5217\u8868\u81EA\u8EAB\u6EDA\u52A8 */
.nw-picker {
	position: absolute;
	top: calc(var(--nw-header-height) + 4px);
	left: 6px;
	right: 6px;
	z-index: 20;
	display: none;
	flex-direction: column;
	max-height: calc(100% - var(--nw-header-height) - 12px);
	box-sizing: border-box;
	background: var(--background-primary, #1e1e1e);
	border: 1px solid var(--background-modifier-border, rgba(255, 255, 255, 0.12));
	border-radius: 6px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
	overflow: hidden;
}
.nw-picker.is-visible { display: flex; }
body.is-collapsed #nw-picker { display: none; }
.nw-picker-input {
	flex: 0 0 auto;
	margin: 6px 6px 4px;
	padding: 5px 8px;
	border: 1px solid var(--background-modifier-border, rgba(255, 255, 255, 0.12));
	border-radius: 4px;
	outline: none;
	background: var(--background-modifier-form-field, rgba(0, 0, 0, 0.2));
	color: var(--text-normal, #dcddde);
	font-family: inherit;
	font-size: 12.5px;
}
.nw-picker-input:focus { border-color: var(--interactive-accent, #7c3aed); }
.nw-picker-list {
	flex: 1 1 auto;
	min-height: 0;
	padding: 0 4px 4px;
	overflow-y: auto;
	overscroll-behavior: contain;
}
.nw-picker-item {
	position: relative;
	padding: 5px 8px;
	border-radius: 4px;
	cursor: pointer;
}
.nw-picker-item:hover, .nw-picker-item.is-active { background: var(--background-modifier-hover, rgba(255, 255, 255, 0.08)); }
.nw-picker-item.is-current { padding-right: 40px; }
.nw-picker-item.is-current .nw-picker-name { color: var(--interactive-accent, #7c3aed); }
.nw-picker-name { font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nw-picker-path { font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-muted, #9aa0a6); }
.nw-picker-badge {
	position: absolute;
	top: 5px;
	right: 6px;
	padding: 0 4px;
	border-radius: 3px;
	font-size: 10px;
	line-height: 15px;
	color: var(--text-on-accent, #ffffff);
	background: var(--interactive-accent, #7c3aed);
}
.nw-picker-empty { padding: 12px 8px; font-size: 12px; color: var(--text-muted, #9aa0a6); }
.nw-empty { padding: 22px 6px; color: var(--text-muted, #9aa0a6); }
.nw-empty-title { margin-bottom: 6px; font-weight: 600; color: var(--text-normal, #dcddde); }
.nw-empty-desc { font-size: 12px; line-height: 1.6; }
/* \u6536\u8D77\u540E\u53EA\u9732\u51FA\u5F88\u7A84\u7684\u4E00\u6761\u89E6\u53D1\u6761\uFF1A\u628A\u6807\u9898\u680F\u6D82\u6210\u5F3A\u8C03\u8272\u4F5C\u4E3A\u63D0\u793A */
body.is-collapsed .nw-title, body.is-collapsed .nw-btn { display: none; }
body.is-collapsed .nw-header { border-bottom: none; background: var(--interactive-accent, #7c3aed); }
body.is-collapsed #nw-root { visibility: hidden; }
`,q=`
(function () {
	var seq = 0;
	var currentLinks = {};
	var banner = document.getElementById('nw-banner');
	var bannerMsg = document.getElementById('nw-banner-msg');
	var bannerTimer = null;
	var picker = document.getElementById('nw-picker');
	var pickerInput = document.getElementById('nw-picker-input');
	var pickerList = document.getElementById('nw-picker-list');
	var pickerItems = [];
	var pickerCurrent = '';
	var pickerFiltered = [];
	var pickerActive = -1;
	var pickerOpen = false;
	function pickerName(path) {
		var base = path.split('/').pop() || path;
		return base.replace(/\\.md$/i, '');
	}
	function closePicker() {
		if (!picker) return;
		pickerOpen = false;
		picker.className = 'nw-picker';
	}
	window.__nwHidePicker = closePicker;
	function setPickerActive(index) {
		if (!pickerList || !pickerFiltered.length) { pickerActive = -1; return; }
		if (index < 0) index = pickerFiltered.length - 1;
		if (index >= pickerFiltered.length) index = 0;
		pickerActive = index;
		var nodes = pickerList.querySelectorAll('.nw-picker-item');
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].classList.toggle('is-active', i === index);
		}
		var active = nodes[index];
		if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest' });
	}
	function renderPickerList() {
		if (!pickerList) return;
		var query = (pickerInput ? pickerInput.value : '').trim().toLowerCase();
		pickerFiltered = pickerItems.filter(function (path) {
			if (!query) return true;
			return path.toLowerCase().indexOf(query) >= 0 || pickerName(path).toLowerCase().indexOf(query) >= 0;
		});
		pickerList.innerHTML = '';
		pickerActive = -1;
		if (!pickerFiltered.length) {
			var empty = document.createElement('div');
			empty.className = 'nw-picker-empty';
			empty.textContent = '\u6CA1\u6709\u5339\u914D\u7684\u7B14\u8BB0';
			pickerList.appendChild(empty);
			return;
		}
		pickerFiltered.forEach(function (path) {
			var item = document.createElement('div');
			item.className = 'nw-picker-item' + (path === pickerCurrent ? ' is-current' : '');
			item.setAttribute('data-nw-path', path);
			var name = document.createElement('div');
			name.className = 'nw-picker-name';
			name.textContent = pickerName(path);
			item.appendChild(name);
			var base = path.split('/').pop() || path;
			var dir = path.slice(0, path.length - base.length).replace(/\\/$/, '');
			if (dir) {
				var sub = document.createElement('div');
				sub.className = 'nw-picker-path';
				sub.textContent = dir;
				item.appendChild(sub);
			}
			if (path === pickerCurrent) {
				var badge = document.createElement('span');
				badge.className = 'nw-picker-badge';
				badge.textContent = '\u5F53\u524D';
				item.appendChild(badge);
			}
			item.addEventListener('mouseenter', function () {
				setPickerActive(pickerFiltered.indexOf(path));
			});
			pickerList.appendChild(item);
		});
		setPickerActive(0);
	}
	window.__nwShowPicker = function (data) {
		if (!picker) return;
		pickerItems = (data && data.notes) || [];
		pickerCurrent = (data && data.current) || '';
		if (pickerInput) pickerInput.value = '';
		pickerOpen = true;
		picker.className = 'nw-picker is-visible';
		renderPickerList();
		if (pickerInput) {
			pickerInput.focus();
			pickerInput.select();
		}
	};
	function choosePickerPath(path) {
		closePicker();
		send('pick-note', path);
	}
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
	window.__nwHideBanner = function () {
		if (bannerTimer) { clearTimeout(bannerTimer); bannerTimer = null; }
		if (!banner) return;
		banner.className = 'nw-banner';
	};
	window.__nwBanner = function (msg, kind) {
		if (!banner) return;
		window.__nwHideBanner();
		banner.className = 'nw-banner is-visible' + (kind ? ' is-' + kind : '');
		if (bannerMsg) bannerMsg.textContent = msg || '';
		if (kind !== 'error') {
			bannerTimer = setTimeout(window.__nwHideBanner, 2200);
		}
	};
	function handleShortcut(ev) {
		if (pickerOpen && ev.key === 'Escape') {
			ev.preventDefault();
			ev.stopPropagation();
			closePicker();
		}
	}
	if (pickerInput) {
		pickerInput.addEventListener('input', function () {
			if (pickerOpen) renderPickerList();
		});
		pickerInput.addEventListener('keydown', function (ev) {
			if (!pickerOpen) return;
			if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
				ev.preventDefault();
				ev.stopPropagation();
				setPickerActive(pickerActive + (ev.key === 'ArrowDown' ? 1 : -1));
				return;
			}
			if (ev.key === 'Enter') {
				ev.preventDefault();
				if (pickerActive >= 0 && pickerFiltered[pickerActive]) choosePickerPath(pickerFiltered[pickerActive]);
			}
		});
	}
	if (pickerList) {
		pickerList.addEventListener('click', function (ev) {
			var item = ev.target && ev.target.closest ? ev.target.closest('[data-nw-path]') : null;
			if (!item) return;
			ev.preventDefault();
			choosePickerPath(item.getAttribute('data-nw-path'));
		});
	}
	document.addEventListener('keydown', handleShortcut, true);
	document.addEventListener('click', function (ev) {
		var node = ev.target;
		if (!node || typeof node.closest !== 'function') return;
		if (pickerOpen) {
			if (node.closest('#nw-picker')) return;
			var pickBtn = node.closest('[data-nw-action="pick"]');
			if (pickBtn) {
				ev.preventDefault();
				ev.stopPropagation();
				closePicker();
				return;
			}
			closePicker();
		}
		var actionEl = node.closest('[data-nw-action]');
		if (actionEl) {
			ev.preventDefault();
			ev.stopPropagation();
			var action = actionEl.getAttribute('data-nw-action');
			send(action, '');
			return;
		}
		var taskEl = node.closest('[data-nw-task]');
		if (taskEl) {
			ev.preventDefault();
			ev.stopPropagation();
			send('task', taskEl.getAttribute('data-nw-task'));
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
		var edge = document.body.getAttribute('data-nw-edge');
		var theme = p.theme === 'theme-light' ? 'theme-light' : 'theme-dark';
		document.documentElement.className = theme;
		document.body.className = 'nw-body ' + theme;
		if (collapsed) {
			document.body.classList.add('is-collapsed');
			if (edge) document.body.setAttribute('data-nw-edge', edge);
		}
		var titleEl = document.getElementById('nw-title');
		var root = document.getElementById('nw-root');
		var nextTitle = p.title || '\u7B14\u8BB0\u5C0F\u90E8\u4EF6';
		// \u540C\u4E00\u7B14\u8BB0\u7684\u5B9E\u65F6\u5237\u65B0\u4FDD\u7559\u9605\u8BFB\u4F4D\u7F6E\uFF0C\u53EA\u6709\u5207\u6362\u7B14\u8BB0\u65F6\u624D\u56DE\u5230\u9876\u90E8
		var sameNote = titleEl.textContent === nextTitle;
		var prevScroll = root.scrollTop;
		titleEl.textContent = nextTitle;
		var pin = document.querySelector('[data-nw-action="pin"]');
		if (pin) pin.classList.toggle('is-active', !!p.pinned);
		root.innerHTML = p.html || '';
		root.scrollTop = sameNote ? prevScroll : 0;
	};
	window.__nwSetCollapsed = function (collapsed, edge) {
		if (collapsed) closePicker();
		document.body.classList.toggle('is-collapsed', !!collapsed);
		if (collapsed) document.body.setAttribute('data-nw-edge', edge || '');
		else document.body.removeAttribute('data-nw-edge');
	};
})();
`;function C(){return`<!DOCTYPE html>
<html class="theme-dark">
<head>
<meta charset="utf-8" />
<style id="nw-app-css"></style>
<style id="nw-chrome-css">${$}</style>
</head>
<body class="nw-body theme-dark">
<header class="nw-header">
	<span class="nw-title" id="nw-title">\u7B14\u8BB0\u5C0F\u90E8\u4EF6</span>
	<button class="nw-btn" type="button" data-nw-action="pick" title="\u9009\u62E9\u7B14\u8BB0">${j}</button>
	<button class="nw-btn" type="button" data-nw-action="edit" title="\u5728\u4E3B\u7A97\u53E3\u4E2D\u7F16\u8F91">${W}</button>
	<button class="nw-btn" type="button" data-nw-action="pin" title="\u59CB\u7EC8\u7F6E\u9876">${D}</button>
	<button class="nw-btn" type="button" data-nw-action="refresh" title="\u5237\u65B0">${z}</button>
	<button class="nw-btn" type="button" data-nw-action="close" title="\u5173\u95ED\u5C0F\u90E8\u4EF6">${V}</button>
</header>
<main id="nw-root" class="markdown-preview-view markdown-rendered"></main>
<div id="nw-picker" class="nw-picker">
	<input id="nw-picker-input" class="nw-picker-input" type="text" placeholder="\u641C\u7D22\u7B14\u8BB0\uFF08\u6587\u4EF6\u540D\u6216\u8DEF\u5F84\uFF09" spellcheck="false" autocomplete="off" />
	<div id="nw-picker-list" class="nw-picker-list"></div>
</div>
<div id="nw-banner" class="nw-banner"><span class="nw-banner-msg" id="nw-banner-msg"></span></div>
<script>${q}<\/script>
</body>
</html>`}var f=6,U=16,J=120,K=4,P="nw-action:",A="\u7B14\u8BB0\u5C0F\u90E8\u4EF6",X=/^\s*(?:>\s*)*(?:[-*+]|\d+[.)])\s+\[[ xX]\](?=\s|$)/,G=/^(\s*(?:>\s*)*(?:[-*+]|\d+[.)])\s+\[)([ xX])(\])/;function Y(c){let t=c.split(`
`),e=[],i=null;for(let n=0;n<t.length;n++){let s=t[n],r=/^\s*(`{3,}|~{3,})/.exec(s);if(r){let a=r[1].charAt(0);i===null?i=a:i===a&&(i=null);continue}i||X.test(s)&&e.push(n)}return e}function L(){try{return require("electron")}catch(c){return null}}function v(){let c=L();if(!c)return null;if(c.remote)return c.remote;try{return require("@electron/remote")}catch(t){return null}}function u(c,t,e){return e<t&&(e=t),Math.max(t,Math.min(e,c))}function Z(c){return c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var y=class{constructor(t){this.plugin=t;this.win=null;this.renderHost=null;this.cssCache=null;this.injectedCss=null;this.injectedLinks=[];this.renderToken=0;this.renderTimer=null;this.moveTimer=null;this.resizeTimer=null;this.hoverTimer=null;this.animTimer=null;this.suppressUntil=0;this.snapEdge=null;this.hidden=!1;this.revealArmed=!1;this.busy=!1;this.outsideTicks=0;this.preserveVisibleState=!1;this.lastRenderSource=null;this.lastRenderPath=null;this.forceRender=!1;this.taskBusy=!1;this.plugin.registerEvent(this.plugin.app.workspace.on("css-change",()=>{this.cssCache=null,this.scheduleRender(120,!0)}))}isOpen(){return!!this.win&&!this.win.isDestroyed()}async toggle(){this.isOpen()?await this.close():await this.open()}async open(){if(this.isOpen()){this.win.show(),this.win.focus();return}let t=v();if(!t||!t.BrowserWindow){console.error("[note-widget] \u65E0\u6CD5\u83B7\u53D6 Electron \u7684 BrowserWindow\uFF0C\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u72EC\u7ACB\u7A97\u53E3");return}let e=this.plugin.settings,i=this.initialBounds(),n=new t.BrowserWindow({x:i.x,y:i.y,width:i.width,height:i.height,frame:!1,transparent:!1,resizable:!0,movable:!0,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!1,alwaysOnTop:e.alwaysOnTop,backgroundColor:this.themeBackground(),title:A,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!1,webSecurity:!1,spellcheck:!1,backgroundThrottling:!1}});this.win=n,this.registerWindowEvents(n);try{await n.loadURL("data:text/html;charset=utf-8,"+encodeURIComponent(C()))}catch(s){console.error("[note-widget] \u5C0F\u90E8\u4EF6\u7A97\u53E3\u52A0\u8F7D\u5931\u8D25",s)}this.isOpen()&&(this.applySettings(),n.show(),e.widgetVisible=!0,await this.plugin.saveSettings(),await this.render(),this.restoreSnappedState())}async close(){let t=this.win;t&&!t.isDestroyed()?t.destroy():this.handleClosed()}destroy(t=!1){this.preserveVisibleState=t;let e=this.win;e&&!e.isDestroyed()?e.destroy():this.handleClosed()}applySettings(){let t=this.win;if(!t||t.isDestroyed())return;let e=this.plugin.settings;t.setAlwaysOnTop(e.alwaysOnTop,"floating"),t.setOpacity(u(e.opacity,.3,1));try{t.webContents.setZoomFactor(u(e.zoom,.6,2))}catch(r){}let i=t.getBounds(),n=u(Math.round(e.width),220,1600),s=u(Math.round(e.height),180,1600);(Math.abs(i.width-n)>4||Math.abs(i.height-s)>4)&&t.setSize(n,s),this.exec(`(function(){var b=document.querySelector('[data-nw-action="pin"]');if(b)b.classList.toggle('is-active',${e.alwaysOnTop?"true":"false"});})()`),e.snapAutoHide||(this.stopHoverWatch(),this.snapEdge=null,this.hidden&&(this.hidden=!1,this.exec("window.__nwSetCollapsed && window.__nwSetCollapsed(false)")))}scheduleRender(t=250,e=!1){e&&(this.forceRender=!0),this.renderTimer&&window.clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>{this.renderTimer=null;let i=this.forceRender;this.forceRender=!1,this.render(i)},t)}async render(t=!1){var d,l,h;let e=this.win;if(!e||e.isDestroyed())return;let i=++this.renderToken,n=this.plugin.getTargetFile(),s,r,a;if(!n)a="\u7B14\u8BB0\u5C0F\u90E8\u4EF6",r=null,s='<div class="nw-empty"><div class="nw-empty-title">\u672A\u9009\u62E9\u7B14\u8BB0</div><div class="nw-empty-desc">\u6253\u5F00\u300C\u8BBE\u7F6E \u2192 \u7B14\u8BB0\u5C0F\u90E8\u4EF6\u300D\uFF0C\u586B\u5165\u7B14\u8BB0\u8DEF\u5F84\u6216\u70B9\u51FB\u300C\u9009\u62E9\u300D\u4ECE\u5E93\u4E2D\u6311\u4E00\u6761\u7B14\u8BB0\u3002</div></div>';else{a=n.basename;let w=await this.buildBody(n,t);s=w.html,r=w.source}if(s===null||i!==this.renderToken||!this.isOpen())return;let o={title:a,html:s,theme:this.themeClass(),pinned:this.plugin.settings.alwaysOnTop,css:this.cssForInjection(),links:this.linksForInjection(),htmlStyle:(d=document.documentElement.getAttribute("style"))!=null?d:"",bodyStyle:(l=document.body.getAttribute("style"))!=null?l:""};try{await e.webContents.executeJavaScript(`window.__nwUpdate && window.__nwUpdate(${JSON.stringify(o)})`,!0)}catch(w){}this.lastRenderSource=r,this.lastRenderPath=(h=n==null?void 0:n.path)!=null?h:null}async buildBody(t,e){let i;try{i=await this.readSource(t)}catch(n){let s=n instanceof Error?n.message:String(n);return{html:`<div class="nw-empty"><div class="nw-empty-title">\u6E32\u67D3\u5931\u8D25</div><div class="nw-empty-desc">${Z(s)}</div></div>`,source:null}}return!e&&i===this.lastRenderSource&&this.lastRenderPath===t.path?{html:null,source:i}:{html:await this.renderNoteHtml(t,i),source:i}}async readSource(t){let e=this.liveEditorSource(t);return e!==null?e:await this.plugin.app.vault.cachedRead(t)}liveEditorSource(t){var e;for(let i of this.plugin.app.workspace.getLeavesOfType("markdown")){let n=i.view;if(n instanceof g.MarkdownView&&((e=n.file)==null?void 0:e.path)===t.path)try{let s=n.editor.getValue();return typeof s=="string"?s:null}catch(s){return null}}return null}registerWindowEvents(t){t.on("move",()=>this.onMove()),t.on("resize",()=>this.onResize()),t.on("closed",()=>this.handleClosed());let e=t.webContents;if(e.on("page-title-updated",(i,n)=>{i.preventDefault(),this.onActionMessage(n),t.isDestroyed()||t.setTitle(A)}),e.on("will-navigate",(i,n)=>{i.preventDefault(),this.handleNavigatedUrl(n)}),typeof e.setWindowOpenHandler=="function")try{e.setWindowOpenHandler(()=>({action:"deny"}))}catch(i){}}handleClosed(){this.win=null,this.clearTimers(),this.injectedCss=null,this.snapEdge=null,this.hidden=!1,this.revealArmed=!1,this.busy=!1,this.lastRenderSource=null,this.lastRenderPath=null,this.forceRender=!1,this.taskBusy=!1,this.cleanupHost(),this.preserveVisibleState||(this.plugin.settings.widgetVisible=!1,this.plugin.saveSettings()),this.preserveVisibleState=!1}onActionMessage(t){if(typeof t!="string"||!t.startsWith(P))return;let e=t.slice(P.length),i=e.indexOf(":");if(i<0)return;let n=e.slice(0,i),s=e.slice(i+1),r=s.indexOf(":");if(r<0)return;let a=s.slice(r+1);try{a=decodeURIComponent(a)}catch(o){}this.handleAction(n,a)}async handleAction(t,e){switch(t){case"pin":await this.setPinned(!this.plugin.settings.alwaysOnTop);break;case"refresh":await this.render(!0);break;case"close":await this.close();break;case"open":e&&await this.plugin.app.workspace.openLinkText(e,"",!1);break;case"external":this.openExternal(e);break;case"edit":await this.openInEditor();break;case"pick":await this.showNotePicker();break;case"pick-note":await this.chooseNote(e);break;case"task":await this.toggleTask(e);break}}handleNavigatedUrl(t){var i,n;let e;try{e=new URL(t)}catch(s){return}if(e.protocol==="notewidget:"){let s=e.host||e.pathname.replace(/^\/+/,""),r=(n=(i=e.searchParams.get("file"))!=null?i:e.searchParams.get("url"))!=null?n:"";this.handleAction(s,r);return}(e.protocol==="http:"||e.protocol==="https:"||e.protocol==="mailto:")&&this.openExternal(t)}openExternal(t){var i;if(!t)return;try{let n=new URL(t);if(!["http:","https:","mailto:"].includes(n.protocol))return}catch(n){return}let e=L();(i=e==null?void 0:e.shell)!=null&&i.openExternal?e.shell.openExternal(t):window.open(t)}async setPinned(t){this.plugin.settings.alwaysOnTop=t,this.isOpen()&&this.win.setAlwaysOnTop(t,"floating"),await this.plugin.saveSettings(),await this.exec(`(function(){var b=document.querySelector('[data-nw-action="pin"]');if(b)b.classList.toggle('is-active',${t?"true":"false"});})()`)}async openInEditor(){var a,o,d;let t=this.plugin.getTargetFile();if(!t){await this.banner("\u672A\u627E\u5230\u76EE\u6807\u7B14\u8BB0\uFF0C\u8BF7\u5148\u5728\u8BBE\u7F6E\u4E2D\u9009\u62E9","error");return}try{await this.plugin.app.vault.read(t)}catch(l){await this.banner("\u8BFB\u53D6\u7B14\u8BB0\u5931\u8D25\uFF0C\u65E0\u6CD5\u6253\u5F00","error");return}let e=this.plugin.app.workspace,i=e.getLeavesOfType("markdown").find(l=>{var h;return((h=l.view.file)==null?void 0:h.path)===t.path});if(!i){i=e.getLeaf("tab");try{await i.openFile(t)}catch(l){await this.banner("\u6253\u5F00\u7B14\u8BB0\u5931\u8D25","error");return}}let n=i.view,s=i.getViewState();if(!s.state||s.state.mode!=="source")try{await i.setViewState({type:"markdown",state:Object.assign({},s.state,{file:t.path,mode:"source"})})}catch(l){await this.banner("\u5207\u6362\u7F16\u8F91\u6A21\u5F0F\u5931\u8D25","error");return}let r=(o=(a=v())==null?void 0:a.getCurrentWindow)==null?void 0:o.call(a);r&&!r.isDestroyed()&&(r.isMinimized()&&r.restore(),r.show(),r.focus()),e.setActiveLeaf(i,{focus:!0}),(d=i.view.editor)==null||d.focus()}async showNotePicker(){var i,n;let t=this.plugin.app.vault.getMarkdownFiles().map(s=>s.path).sort((s,r)=>s.localeCompare(r,"zh")),e=(n=(i=this.plugin.getTargetFile())==null?void 0:i.path)!=null?n:this.plugin.settings.notePath;await this.exec(`window.__nwShowPicker && window.__nwShowPicker(${JSON.stringify({notes:t,current:e})})`)}async chooseNote(t){let e=this.plugin.app.vault.getAbstractFileByPath(t);if(!(e instanceof g.TFile)){await this.banner("\u627E\u4E0D\u5230\u8FD9\u6761\u7B14\u8BB0\uFF0C\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5","error");return}this.plugin.settings.notePath=e.path,await this.plugin.saveSettings(),await this.handleTargetChanged()}async banner(t,e="info"){await this.exec(`window.__nwBanner && window.__nwBanner(${JSON.stringify(t)}, ${JSON.stringify(e)})`)}handleVaultChange(){this.scheduleRender()}handleEditorChange(t){if(!this.isOpen())return;let e=t==null?void 0:t.file;if(!(e instanceof g.TFile))return;let i=this.plugin.getTargetFile();!i||i.path!==e.path||this.scheduleRender()}async handleTargetChanged(){await this.render(!0)}async toggleTask(t){if(this.taskBusy)return;let e=Number(t);if(!Number.isInteger(e)||e<0)return;let i=this.plugin.getTargetFile();if(!i){await this.banner("\u672A\u627E\u5230\u76EE\u6807\u7B14\u8BB0","error");return}let n;try{n=await this.plugin.app.vault.read(i)}catch(h){await this.banner("\u8BFB\u53D6\u7B14\u8BB0\u5931\u8D25\uFF0C\u52FE\u9009\u672A\u4FDD\u5B58","error");return}if(this.lastRenderSource!==null&&n!==this.lastRenderSource){await this.render(!0),await this.banner("\u7B14\u8BB0\u5DF2\u5728\u522B\u5904\u88AB\u4FEE\u6539\uFF0C\u5DF2\u5237\u65B0\uFF0C\u8BF7\u91CD\u65B0\u52FE\u9009","error");return}let s=n.split(`
`),r=s[e],a=typeof r=="string"?G.exec(r):null;if(!a){await this.render(!0),await this.banner("\u6CA1\u6709\u627E\u5230\u5BF9\u5E94\u7684\u4EFB\u52A1\u884C\uFF0C\u5DF2\u5237\u65B0","error");return}let o=a[2]===" "?"x":" ";s[e]=a[1]+o+a[3]+r.slice(a[0].length);let d=s.join(`
`);this.taskBusy=!0;let l=!1;try{await this.plugin.app.vault.process(i,h=>h!==n?(l=!0,h):d)}catch(h){this.taskBusy=!1,await this.banner("\u5199\u56DE\u7B14\u8BB0\u5931\u8D25\uFF0C\u52FE\u9009\u672A\u4FDD\u5B58","error");return}this.taskBusy=!1,await this.render(!0),l&&await this.banner("\u7B14\u8BB0\u5DF2\u5728\u522B\u5904\u88AB\u4FEE\u6539\uFF0C\u5DF2\u5237\u65B0\uFF0C\u8BF7\u91CD\u65B0\u52FE\u9009","error")}async renderNoteHtml(t,e){let i=this.plugin.app,n=this.getRenderHost();n.empty();let s=this.isOpen()?this.win.getBounds().width:this.plugin.settings.width;n.style.width=`${Math.max(200,s-28)}px`;try{let r=Y(e);return await g.MarkdownRenderer.render(i,e,n,t.path,this.plugin),await new Promise(a=>window.setTimeout(a,80)),this.rewriteLinks(n,t),this.annotateTaskCheckboxes(n,r),n.innerHTML}finally{n.empty()}}rewriteLinks(t,e){t.querySelectorAll("a").forEach(i=>{var r,a;let n=(r=i.getAttribute("href"))!=null?r:"",s=(a=i.getAttribute("data-href"))!=null?a:n;if(i.classList.contains("internal-link")||i.hasAttribute("data-href")){let o=this.plugin.app.metadataCache.getFirstLinkpathDest(s,e.path);o&&i.setAttribute("data-nw-open",o.path),i.removeAttribute("href");return}if(/^javascript:/i.test(n)){i.removeAttribute("href");return}(/^(https?:|mailto:)/i.test(n)||i.classList.contains("external-link"))&&n&&i.setAttribute("data-nw-external",n)})}annotateTaskCheckboxes(t,e){let i=t.querySelectorAll('input[type="checkbox"]');!i.length||i.length!==e.length||i.forEach((n,s)=>{n.setAttribute("data-nw-task",String(e[s])),n.removeAttribute("disabled"),n.disabled=!1})}getRenderHost(){return(!this.renderHost||!this.renderHost.isConnected)&&(this.renderHost=document.body.createDiv({cls:"note-widget-render-host"})),this.renderHost}cleanupHost(){var t;(t=this.renderHost)!=null&&t.isConnected&&this.renderHost.remove(),this.renderHost=null}collectStyles(){let t=[];document.querySelectorAll("style").forEach(i=>{let n=i.textContent;n&&n.trim()&&t.push(n)});let e=[];return document.querySelectorAll('link[rel="stylesheet"]').forEach(i=>{let n=i.href;n&&e.push(n)}),{css:t.join(`
`),links:e}}cssForInjection(){return this.cssCache===null&&(this.cssCache=this.collectStyles()),this.cssCache.css===this.injectedCss?null:(this.injectedCss=this.cssCache.css,this.cssCache.css)}linksForInjection(){this.cssCache===null&&(this.cssCache=this.collectStyles());let t=this.cssCache.links;return t.length===this.injectedLinks.length&&t.every((e,i)=>e===this.injectedLinks[i])?this.injectedLinks:(this.injectedLinks=t,t)}themeClass(){return document.body.classList.contains("theme-light")?"theme-light":"theme-dark"}themeBackground(){let t=getComputedStyle(document.body).backgroundColor;return t&&t!=="rgba(0, 0, 0, 0)"&&t!=="transparent"?t:"#1e1e1e"}initialBounds(){let t=this.plugin.settings,e=u(Math.round(t.width),220,1600),i=u(Math.round(t.height),180,1600),n=v(),s=n==null?void 0:n.screen;if(t.x===null||t.y===null){let o=s?s.getPrimaryDisplay().workArea:{x:0,y:0,width:window.screen.availWidth,height:window.screen.availHeight};return{x:o.x+o.width-e-24,y:o.y+o.height-i-24,width:e,height:i}}let r=t.x,a=t.y;if(s){let d=s.getDisplayNearestPoint({x:r,y:a}).workArea;r=u(r,d.x,d.x+d.width-e),a=u(a,d.y,d.y+d.height-i)}return{x:r,y:a,width:e,height:i}}onMove(){this.isOpen()&&(this.hidden||this.busy||Date.now()<this.suppressUntil||(this.moveTimer&&window.clearTimeout(this.moveTimer),this.moveTimer=window.setTimeout(()=>{this.moveTimer=null,this.afterUserMove()},300)))}async afterUserMove(){if(!this.isOpen()||this.hidden||(this.savePosition(),!this.plugin.settings.snapAutoHide))return;let t=this.detectEdge();t&&await this.collapseToEdge(t)}onResize(){this.isOpen()&&(Date.now()<this.suppressUntil||(this.resizeTimer&&window.clearTimeout(this.resizeTimer),this.resizeTimer=window.setTimeout(()=>{if(this.resizeTimer=null,!this.isOpen())return;let t=this.win.getBounds(),e=this.plugin.settings;Math.abs(t.width-e.width)<=4&&Math.abs(t.height-e.height)<=4||(e.width=t.width,e.height=t.height,this.plugin.saveSettings(),this.scheduleRender(180,!0))},300)))}savePosition(){if(!this.isOpen())return;let t=this.win.getBounds(),e=this.plugin.settings;e.x===t.x&&e.y===t.y||(e.x=t.x,e.y=t.y,this.plugin.saveSettings())}restoreSnappedState(){if(!this.isOpen()||!this.plugin.settings.snapAutoHide)return;let t=this.detectEdge();t&&(this.snapEdge=t,this.hidden=!1,this.revealArmed=!0,this.startHoverWatch())}detectEdge(){if(!this.isOpen())return null;let t=this.win.getBounds(),e=this.workArea(t),i={left:Math.abs(t.x-e.x),right:Math.abs(e.x+e.width-(t.x+t.width)),top:Math.abs(t.y-e.y),bottom:Math.abs(e.y+e.height-(t.y+t.height))},n=null,s=U+1;return["left","right","top","bottom"].forEach(r=>{i[r]<s&&(s=i[r],n=r)}),n}workArea(t){let e=v(),i=e==null?void 0:e.screen;if(i!=null&&i.getDisplayMatching){let n=i.getDisplayMatching(t),s=n==null?void 0:n.workArea;if(s&&[s.x,s.y,s.width,s.height].every(r=>Number.isFinite(r)))return s}return{x:0,y:0,width:window.screen.availWidth,height:window.screen.availHeight}}flushBounds(t,e,i){switch(t){case"left":return{x:i.x,y:e.y};case"right":return{x:i.x+i.width-e.width,y:e.y};case"top":return{x:e.x,y:i.y};case"bottom":return{x:e.x,y:i.y+i.height-e.height}}return{x:e.x,y:e.y}}hiddenPosition(t,e,i){switch(t){case"left":return{x:i.x-e.width+f,y:e.y};case"right":return{x:i.x+i.width-f,y:e.y};case"top":return{x:e.x,y:i.y-e.height+f};case"bottom":return{x:e.x,y:i.y+i.height-f}}return{x:e.x,y:e.y}}async collapseToEdge(t){if(!(!this.isOpen()||this.busy)){this.busy=!0;try{let e=this.win.getBounds(),i=this.workArea(e);this.snapEdge=t;let n=this.flushBounds(t,e,i);await this.animateTo(n,120),this.plugin.settings.x=n.x,this.plugin.settings.y=n.y,this.plugin.saveSettings();let s=this.hiddenPosition(t,e,i);await this.animateTo(s,170),this.hidden=!0,this.revealArmed=!1,await this.exec(`window.__nwSetCollapsed && window.__nwSetCollapsed(true, '${t}')`),this.startHoverWatch()}finally{this.busy=!1}}}async expand(){if(!(!this.isOpen()||this.busy||!this.snapEdge)){this.busy=!0;try{await this.exec("window.__nwSetCollapsed && window.__nwSetCollapsed(false)");let t=this.win.getBounds(),e=this.workArea(t),i=this.flushBounds(this.snapEdge,t,e);this.hidden=!1,this.outsideTicks=0,this.revealArmed=!0,await this.animateTo(i,150)}finally{this.busy=!1}}}async collapseAgain(){if(!(!this.isOpen()||this.busy||!this.snapEdge)){this.busy=!0;try{let t=this.win.getBounds(),e=this.workArea(t),i=this.hiddenPosition(this.snapEdge,t,e);await this.animateTo(i,170),this.hidden=!0,this.revealArmed=!1,await this.exec(`window.__nwSetCollapsed && window.__nwSetCollapsed(true, '${this.snapEdge}')`)}finally{this.busy=!1}}}startHoverWatch(){this.hoverTimer||(this.outsideTicks=0,this.hoverTimer=window.setInterval(()=>this.hoverTick(),J))}stopHoverWatch(){this.hoverTimer&&(window.clearInterval(this.hoverTimer),this.hoverTimer=null),this.outsideTicks=0}hoverTick(){if(!this.isOpen()){this.stopHoverWatch();return}if(!this.plugin.settings.snapAutoHide||!this.snapEdge){this.stopHoverWatch();return}if(this.busy)return;let t=this.cursorPoint();if(t){if(this.hidden){let e=this.pointInRect(t,this.triggerRect(this.snapEdge));if(!this.revealArmed){e||(this.revealArmed=!0);return}e&&this.expand();return}if(this.pointInRect(t,this.inflateRect(this.win.getBounds(),10))){this.outsideTicks=0;return}this.outsideTicks+=1,this.outsideTicks>=K&&(this.outsideTicks=0,this.collapseAgain())}}triggerRect(t){let e=this.win.getBounds(),i=this.workArea(e),n=f+6;switch(t){case"left":return{x:i.x,y:e.y,width:n,height:e.height};case"right":return{x:i.x+i.width-n,y:e.y,width:n,height:e.height};case"top":return{x:e.x,y:i.y,width:e.width,height:n};case"bottom":return{x:e.x,y:i.y+i.height-n,width:e.width,height:n}}}inflateRect(t,e){return{x:t.x-e,y:t.y-e,width:t.width+e*2,height:t.height+e*2}}pointInRect(t,e){return t.x>=e.x&&t.x<=e.x+e.width&&t.y>=e.y&&t.y<=e.y+e.height}cursorPoint(){var i;let t=(i=v())==null?void 0:i.screen;if(!(t!=null&&t.getCursorScreenPoint))return null;let e=t.getCursorScreenPoint();return{x:e.x,y:e.y}}async animateTo(t,e){let i=this.win;if(!i||i.isDestroyed())return;if(!t||!Number.isFinite(t.x)||!Number.isFinite(t.y)){console.warn("[note-widget] \u5FFD\u7565\u65E0\u6548\u7684\u7A97\u53E3\u4F4D\u7F6E",t);return}this.animTimer&&(window.clearTimeout(this.animTimer),this.animTimer=null);let n=0,s=0;try{let l=i.getPosition();n=Number(l==null?void 0:l[0]),s=Number(l==null?void 0:l[1])}catch(l){return}if(!Number.isFinite(n)||!Number.isFinite(s))return;let r=this.plugin.settings,a=u(Math.round(r.width),220,1600),o=u(Math.round(r.height),180,1600);if(!Number.isFinite(a)||!Number.isFinite(o))try{let l=i.getBounds();a=l.width,o=l.height}catch(l){return}if(!Number.isFinite(a)||!Number.isFinite(o)||a<=0||o<=0||Math.abs(n-t.x)<1&&Math.abs(s-t.y)<1)return;this.suppressUntil=Date.now()+e+600;let d=Date.now();await new Promise(l=>{let h=()=>{if(this.animTimer=null,!this.isOpen()){l();return}let w=Math.min(1,(Date.now()-d)/e),S=1-Math.pow(1-w,3),N=Math.round(n+(t.x-n)*S),O=Math.round(s+(t.y-s)*S);try{this.win.setBounds({x:N,y:O,width:a,height:o},!1)}catch(I){console.warn("[note-widget] \u79FB\u52A8\u7A97\u53E3\u5931\u8D25",I),l();return}w<1?this.animTimer=window.setTimeout(h,16):l()};h()})}clearTimers(){this.renderTimer&&window.clearTimeout(this.renderTimer),this.moveTimer&&window.clearTimeout(this.moveTimer),this.resizeTimer&&window.clearTimeout(this.resizeTimer),this.animTimer&&window.clearTimeout(this.animTimer),this.renderTimer=null,this.moveTimer=null,this.resizeTimer=null,this.animTimer=null,this.stopHoverWatch()}async exec(t){if(this.isOpen())try{await this.win.webContents.executeJavaScript(t,!0)}catch(e){}}};var k=class extends m.Plugin{async onload(){await this.loadSettings(),this.widget=new y(this),this.addRibbonIcon("panel-top","\u6253\u5F00/\u5173\u95ED\u7B14\u8BB0\u5C0F\u90E8\u4EF6",()=>void this.widget.toggle()),this.addCommand({id:"toggle-note-widget",name:"\u6253\u5F00/\u5173\u95ED\u7B14\u8BB0\u5C0F\u90E8\u4EF6",callback:()=>void this.widget.toggle()}),this.addCommand({id:"refresh-note-widget",name:"\u5237\u65B0\u7B14\u8BB0\u5C0F\u90E8\u4EF6",callback:()=>void this.widget.render()}),this.addSettingTab(new b(this.app,this)),this.registerEvent(this.app.vault.on("modify",t=>{var e;t instanceof m.TFile&&t.path===((e=this.getTargetFile())==null?void 0:e.path)&&this.widget.handleVaultChange()})),this.registerEvent(this.app.workspace.on("editor-change",(t,e)=>{this.widget.handleEditorChange(e)})),this.registerEvent(this.app.vault.on("rename",(t,e)=>{e!==this.settings.notePath||!(t instanceof m.TFile)||(this.settings.notePath=t.path,this.saveSettings(),this.widget.scheduleRender())})),this.registerEvent(this.app.vault.on("delete",t=>{t.path===this.settings.notePath&&this.widget.handleTargetChanged()})),this.app.workspace.onLayoutReady(()=>{this.settings.widgetVisible&&this.widget.open()})}onunload(){var t;(t=this.widget)==null||t.destroy(!0)}async loadSettings(){this.settings=Object.assign({},E,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}applySettings(){var t;(t=this.widget)==null||t.applySettings()}getTargetFile(){var r,a;let t=((r=this.settings.notePath)!=null?r:"").trim();if(!t)return null;let e=t.replace(/^\/+/,""),i=e.toLowerCase().endsWith(".md")?[e]:[e,`${e}.md`];for(let o of i){let d=this.app.vault.getAbstractFileByPath(o);if(d instanceof m.TFile)return d}let n=this.app.metadataCache.getFirstLinkpathDest(e,"");if(n)return n;let s=e.toLowerCase();return(a=this.app.vault.getMarkdownFiles().find(o=>o.path.toLowerCase()===s||o.basename.toLowerCase()===s))!=null?a:null}};
