/*
Obsidian Note Widget
*/
"use strict";var y=Object.defineProperty;var M=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var D=Object.prototype.hasOwnProperty;var F=(l,t)=>{for(var e in t)y(l,e,{get:t[e],enumerable:!0})},B=(l,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of N(t))!D.call(l,s)&&s!==e&&y(l,s,{get:()=>t[s],enumerable:!(i=M(t,s))||i.enumerable});return l};var I=l=>B(y({},"__esModule",{value:!0}),l);var J={};F(J,{default:()=>v});module.exports=I(J);var p=require("obsidian");var d=require("obsidian"),S={notePath:"",alwaysOnTop:!0,snapAutoHide:!0,opacity:1,zoom:1,width:360,height:480,x:null,y:null,widgetVisible:!1},b=class extends d.FuzzySuggestModal{constructor(e,i){super(e);this.onPick=i;this.setPlaceholder("\u641C\u7D22\u5E93\u4E2D\u7684\u7B14\u8BB0\u2026")}getItems(){return this.app.vault.getMarkdownFiles()}getItemText(e){return e.path}onChooseItem(e){this.onPick(e)}},w=class extends d.PluginSettingTab{constructor(e,i){super(e,i);this.plugin=i;this.statusEl=null;this.pathText=null}display(){let{containerEl:e}=this;e.empty(),e.addClass("note-widget-settings"),e.createEl("h2",{text:"\u7B14\u8BB0\u5C0F\u90E8\u4EF6"}),e.createEl("p",{cls:"setting-item-description",text:"\u5C0F\u90E8\u4EF6\u662F\u4E00\u4E2A\u72EC\u7ACB\u4E8E Obsidian \u4E3B\u7A97\u53E3\u7684\u65E0\u8FB9\u6846\u684C\u9762\u7A97\u53E3\uFF08\u4EC5\u684C\u9762\u7AEF\u53EF\u7528\uFF09\u3002\u62D6\u52A8\u6807\u9898\u680F\u53EF\u79FB\u52A8\u7A97\u53E3\uFF0C\u62D6\u52A8\u7A97\u53E3\u8FB9\u7F18\u53EF\u6539\u53D8\u5927\u5C0F\u3002"}),new d.Setting(e).setName("\u76EE\u6807\u7B14\u8BB0").setDesc("\u586B\u5199\u5E93\u5185\u76F8\u5BF9\u8DEF\u5F84\uFF08\u4F8B\u5982 Notes/\u4ECA\u65E5\u5F85\u529E.md\uFF09\uFF0C\u6216\u70B9\u51FB\u300C\u9009\u62E9\u300D\u4ECE\u5E93\u4E2D\u6311\u9009\u3002").addText(i=>{this.pathText=i,i.setPlaceholder("Notes/\u4ECA\u65E5\u5F85\u529E.md").setValue(this.plugin.settings.notePath).onChange(async s=>{this.plugin.settings.notePath=s.trim(),await this.plugin.saveSettings(),this.plugin.widget.scheduleRender(150),this.refreshStatus()})}).addButton(i=>{i.setButtonText("\u9009\u62E9").onClick(()=>{new b(this.app,async s=>{var n;this.plugin.settings.notePath=s.path,await this.plugin.saveSettings(),(n=this.pathText)==null||n.setValue(s.path),this.plugin.widget.scheduleRender(0),this.refreshStatus()}).open()})}),this.statusEl=e.createDiv({cls:"note-widget-status"}),this.refreshStatus(),new d.Setting(e).setName("\u59CB\u7EC8\u7F6E\u9876").setDesc("\u8BA9\u5C0F\u90E8\u4EF6\u59CB\u7EC8\u663E\u793A\u5728\u5176\u4ED6\u7A97\u53E3\u4E4B\u4E0A\uFF0C\u4E5F\u53EF\u4EE5\u5728\u7A97\u53E3\u53F3\u4E0A\u89D2\u7684\u9762\u677F\u6309\u94AE\u91CC\u968F\u65F6\u5207\u6362\u3002").addToggle(i=>i.setValue(this.plugin.settings.alwaysOnTop).onChange(async s=>{this.plugin.settings.alwaysOnTop=s,this.plugin.applySettings(),await this.plugin.saveSettings()})),new d.Setting(e).setName("\u8D34\u8FB9\u81EA\u52A8\u9690\u85CF").setDesc("\u628A\u7A97\u53E3\u62D6\u5230\u5C4F\u5E55\u4EFB\u610F\u4E00\u6761\u8FB9\u540E\u81EA\u52A8\u6536\u8D77\uFF0C\u53EA\u5728\u8FB9\u7F18\u7559\u4E00\u6761\u5F88\u7A84\u7684\u89E6\u53D1\u6761\uFF1B\u9F20\u6807\u79FB\u5165\u65F6\u6ED1\u51FA\uFF0C\u79FB\u51FA\u540E\u6536\u56DE\u3002").addToggle(i=>i.setValue(this.plugin.settings.snapAutoHide).onChange(async s=>{this.plugin.settings.snapAutoHide=s,this.plugin.applySettings(),await this.plugin.saveSettings()})),new d.Setting(e).setName("\u7A97\u53E3\u4E0D\u900F\u660E\u5EA6").setDesc("\u65B9\u4FBF\u5728\u5C0F\u90E8\u4EF6\u4E0B\u7EE7\u7EED\u64CD\u4F5C\u5176\u4ED6\u5E94\u7528\u3002").addSlider(i=>i.setLimits(.4,1,.05).setValue(this.plugin.settings.opacity).setDynamicTooltip().onChange(async s=>{this.plugin.settings.opacity=s,this.plugin.applySettings(),await this.plugin.saveSettings()})),new d.Setting(e).setName("\u5185\u5BB9\u7F29\u653E").addSlider(i=>i.setLimits(.7,1.6,.05).setValue(this.plugin.settings.zoom).setDynamicTooltip().onChange(async s=>{this.plugin.settings.zoom=s,this.plugin.applySettings(),await this.plugin.saveSettings()})),new d.Setting(e).setName("\u7A97\u53E3\u5BBD\u5EA6").addSlider(i=>i.setLimits(240,800,10).setValue(this.plugin.settings.width).setDynamicTooltip().onChange(async s=>{this.plugin.settings.width=s,this.plugin.applySettings(),await this.plugin.saveSettings()})),new d.Setting(e).setName("\u7A97\u53E3\u9AD8\u5EA6").addSlider(i=>i.setLimits(200,900,10).setValue(this.plugin.settings.height).setDynamicTooltip().onChange(async s=>{this.plugin.settings.height=s,this.plugin.applySettings(),await this.plugin.saveSettings()})),new d.Setting(e).setName("\u663E\u793A / \u5173\u95ED\u5C0F\u90E8\u4EF6").setDesc("\u4E5F\u53EF\u4EE5\u7528\u5DE6\u4FA7\u8FB9\u680F\u7684\u9762\u677F\u56FE\u6807\uFF0C\u6216\u5728\u547D\u4EE4\u9762\u677F\u6267\u884C\u300C\u6253\u5F00/\u5173\u95ED\u7B14\u8BB0\u5C0F\u90E8\u4EF6\u300D\u3002").addButton(i=>i.setButtonText("\u6253\u5F00").onClick(async()=>{await this.plugin.widget.open()})).addButton(i=>i.setButtonText("\u5173\u95ED").onClick(async()=>{await this.plugin.widget.close()}))}refreshStatus(){if(!this.statusEl)return;this.statusEl.removeClass("is-warning");let e=this.plugin.getTargetFile();if(e){this.statusEl.setText(`\u5DF2\u5173\u8054\uFF1A${e.path}`);return}this.statusEl.addClass("is-warning"),this.statusEl.setText(this.plugin.settings.notePath?"\u672A\u5728\u5E93\u4E2D\u627E\u5230\u8FD9\u6761\u7B14\u8BB0\uFF0C\u8BF7\u68C0\u67E5\u8DEF\u5F84\uFF08\u9700\u8981\u5305\u542B .md\uFF09\u3002":"\u5C1A\u672A\u9009\u62E9\u76EE\u6807\u7B14\u8BB0\u3002")}};var P=require("obsidian");var _='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>',W='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v5h-5"/></svg>',z='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',V=`
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
`,j=`
(function () {
	var seq = 0;
	var currentLinks = {};
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
	document.addEventListener('click', function (ev) {
		var node = ev.target;
		if (!node || typeof node.closest !== 'function') return;
		var actionEl = node.closest('[data-nw-action]');
		if (actionEl) {
			ev.preventDefault();
			ev.stopPropagation();
			send(actionEl.getAttribute('data-nw-action'), '');
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
<style id="nw-chrome-css">${V}</style>
</head>
<body class="nw-body theme-dark">
<header class="nw-header">
	<span class="nw-title" id="nw-title">\u7B14\u8BB0\u5C0F\u90E8\u4EF6</span>
	<button class="nw-btn" type="button" data-nw-action="pin" title="\u59CB\u7EC8\u7F6E\u9876">${_}</button>
	<button class="nw-btn" type="button" data-nw-action="refresh" title="\u5237\u65B0">${W}</button>
	<button class="nw-btn" type="button" data-nw-action="close" title="\u5173\u95ED\u5C0F\u90E8\u4EF6">${z}</button>
</header>
<main id="nw-root" class="markdown-preview-view markdown-rendered"></main>
<script>${j}<\/script>
</body>
</html>`}var g=6,U=16,$=120,q=4,C="nw-action:",A="\u7B14\u8BB0\u5C0F\u90E8\u4EF6";function L(){try{return require("electron")}catch(l){return null}}function m(){let l=L();if(!l)return null;if(l.remote)return l.remote;try{return require("@electron/remote")}catch(t){return null}}function u(l,t,e){return e<t&&(e=t),Math.max(t,Math.min(e,l))}function G(l){return l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var f=class{constructor(t){this.plugin=t;this.win=null;this.renderHost=null;this.cssCache=null;this.injectedCss=null;this.injectedLinks=[];this.renderToken=0;this.renderTimer=null;this.moveTimer=null;this.resizeTimer=null;this.hoverTimer=null;this.animTimer=null;this.suppressUntil=0;this.snapEdge=null;this.hidden=!1;this.revealArmed=!1;this.busy=!1;this.outsideTicks=0;this.preserveVisibleState=!1;this.plugin.registerEvent(this.plugin.app.workspace.on("css-change",()=>{this.cssCache=null,this.scheduleRender(120)}))}isOpen(){return!!this.win&&!this.win.isDestroyed()}async toggle(){this.isOpen()?await this.close():await this.open()}async open(){if(this.isOpen()){this.win.show(),this.win.focus();return}let t=m();if(!t||!t.BrowserWindow){console.error("[note-widget] \u65E0\u6CD5\u83B7\u53D6 Electron \u7684 BrowserWindow\uFF0C\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u72EC\u7ACB\u7A97\u53E3");return}let e=this.plugin.settings,i=this.initialBounds(),s=new t.BrowserWindow({x:i.x,y:i.y,width:i.width,height:i.height,frame:!1,transparent:!1,resizable:!0,movable:!0,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!1,alwaysOnTop:e.alwaysOnTop,backgroundColor:this.themeBackground(),title:A,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!1,webSecurity:!1,spellcheck:!1,backgroundThrottling:!1}});this.win=s,this.registerWindowEvents(s);try{await s.loadURL("data:text/html;charset=utf-8,"+encodeURIComponent(E()))}catch(n){console.error("[note-widget] \u5C0F\u90E8\u4EF6\u7A97\u53E3\u52A0\u8F7D\u5931\u8D25",n)}this.isOpen()&&(this.applySettings(),s.show(),e.widgetVisible=!0,await this.plugin.saveSettings(),await this.render(),this.restoreSnappedState())}async close(){let t=this.win;t&&!t.isDestroyed()?t.destroy():this.handleClosed()}destroy(t=!1){this.preserveVisibleState=t;let e=this.win;e&&!e.isDestroyed()?e.destroy():this.handleClosed()}applySettings(){let t=this.win;if(!t||t.isDestroyed())return;let e=this.plugin.settings;t.setAlwaysOnTop(e.alwaysOnTop,"floating"),t.setOpacity(u(e.opacity,.3,1));try{t.webContents.setZoomFactor(u(e.zoom,.6,2))}catch(r){}let i=t.getBounds(),s=u(Math.round(e.width),220,1600),n=u(Math.round(e.height),180,1600);(Math.abs(i.width-s)>4||Math.abs(i.height-n)>4)&&t.setSize(s,n),this.exec(`(function(){var b=document.querySelector('[data-nw-action="pin"]');if(b)b.classList.toggle('is-active',${e.alwaysOnTop?"true":"false"});})()`),e.snapAutoHide||(this.stopHoverWatch(),this.snapEdge=null,this.hidden&&(this.hidden=!1,this.exec("window.__nwSetCollapsed && window.__nwSetCollapsed(false)")))}scheduleRender(t=250){this.renderTimer&&window.clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>{this.renderTimer=null,this.render()},t)}async render(){var a,o;let t=this.win;if(!t||t.isDestroyed())return;let e=++this.renderToken,i=this.plugin.getTargetFile(),s,n;if(i?(n=i.basename,s=await this.renderNoteHtml(i)):(n="\u7B14\u8BB0\u5C0F\u90E8\u4EF6",s='<div class="nw-empty"><div class="nw-empty-title">\u672A\u9009\u62E9\u7B14\u8BB0</div><div class="nw-empty-desc">\u6253\u5F00\u300C\u8BBE\u7F6E \u2192 \u7B14\u8BB0\u5C0F\u90E8\u4EF6\u300D\uFF0C\u586B\u5165\u7B14\u8BB0\u8DEF\u5F84\u6216\u70B9\u51FB\u300C\u9009\u62E9\u300D\u4ECE\u5E93\u4E2D\u6311\u4E00\u6761\u7B14\u8BB0\u3002</div></div>'),e!==this.renderToken||!this.isOpen())return;let r={title:n,html:s,theme:this.themeClass(),pinned:this.plugin.settings.alwaysOnTop,css:this.cssForInjection(),links:this.linksForInjection(),htmlStyle:(a=document.documentElement.getAttribute("style"))!=null?a:"",bodyStyle:(o=document.body.getAttribute("style"))!=null?o:""};try{await t.webContents.executeJavaScript(`window.__nwUpdate && window.__nwUpdate(${JSON.stringify(r)})`,!0)}catch(c){}}registerWindowEvents(t){t.on("move",()=>this.onMove()),t.on("resize",()=>this.onResize()),t.on("closed",()=>this.handleClosed());let e=t.webContents;if(e.on("page-title-updated",(i,s)=>{i.preventDefault(),this.onActionMessage(s),t.isDestroyed()||t.setTitle(A)}),e.on("will-navigate",(i,s)=>{i.preventDefault(),this.handleNavigatedUrl(s)}),typeof e.setWindowOpenHandler=="function")try{e.setWindowOpenHandler(()=>({action:"deny"}))}catch(i){}}handleClosed(){this.win=null,this.clearTimers(),this.injectedCss=null,this.snapEdge=null,this.hidden=!1,this.revealArmed=!1,this.busy=!1,this.cleanupHost(),this.preserveVisibleState||(this.plugin.settings.widgetVisible=!1,this.plugin.saveSettings()),this.preserveVisibleState=!1}onActionMessage(t){if(typeof t!="string"||!t.startsWith(C))return;let e=t.slice(C.length),i=e.indexOf(":");if(i<0)return;let s=e.slice(0,i),n=e.slice(i+1),r=n.indexOf(":");if(r<0)return;let a=n.slice(r+1);try{a=decodeURIComponent(a)}catch(o){}this.handleAction(s,a)}async handleAction(t,e){switch(t){case"pin":await this.setPinned(!this.plugin.settings.alwaysOnTop);break;case"refresh":await this.render();break;case"close":await this.close();break;case"open":e&&await this.plugin.app.workspace.openLinkText(e,"",!1);break;case"external":this.openExternal(e);break}}handleNavigatedUrl(t){var i,s;let e;try{e=new URL(t)}catch(n){return}if(e.protocol==="notewidget:"){let n=e.host||e.pathname.replace(/^\/+/,""),r=(s=(i=e.searchParams.get("file"))!=null?i:e.searchParams.get("url"))!=null?s:"";this.handleAction(n,r);return}(e.protocol==="http:"||e.protocol==="https:"||e.protocol==="mailto:")&&this.openExternal(t)}openExternal(t){var i;if(!t)return;try{let s=new URL(t);if(!["http:","https:","mailto:"].includes(s.protocol))return}catch(s){return}let e=L();(i=e==null?void 0:e.shell)!=null&&i.openExternal?e.shell.openExternal(t):window.open(t)}async setPinned(t){this.plugin.settings.alwaysOnTop=t,this.isOpen()&&this.win.setAlwaysOnTop(t,"floating"),await this.plugin.saveSettings(),await this.exec(`(function(){var b=document.querySelector('[data-nw-action="pin"]');if(b)b.classList.toggle('is-active',${t?"true":"false"});})()`)}async renderNoteHtml(t){let e=this.plugin.app,i=this.getRenderHost();i.empty();let s=this.isOpen()?this.win.getBounds().width:this.plugin.settings.width;i.style.width=`${Math.max(200,s-28)}px`;try{let n=await e.vault.cachedRead(t);return await P.MarkdownRenderer.render(e,n,i,t.path,this.plugin),await new Promise(r=>window.setTimeout(r,80)),this.rewriteLinks(i,t),i.innerHTML}catch(n){let r=n instanceof Error?n.message:String(n);return`<div class="nw-empty"><div class="nw-empty-title">\u6E32\u67D3\u5931\u8D25</div><div class="nw-empty-desc">${G(r)}</div></div>`}finally{i.empty()}}rewriteLinks(t,e){t.querySelectorAll("a").forEach(i=>{var r,a;let s=(r=i.getAttribute("href"))!=null?r:"",n=(a=i.getAttribute("data-href"))!=null?a:s;if(i.classList.contains("internal-link")||i.hasAttribute("data-href")){let o=this.plugin.app.metadataCache.getFirstLinkpathDest(n,e.path);o&&i.setAttribute("data-nw-open",o.path),i.removeAttribute("href");return}if(/^javascript:/i.test(s)){i.removeAttribute("href");return}(/^(https?:|mailto:)/i.test(s)||i.classList.contains("external-link"))&&s&&i.setAttribute("data-nw-external",s)})}getRenderHost(){return(!this.renderHost||!this.renderHost.isConnected)&&(this.renderHost=document.body.createDiv({cls:"note-widget-render-host"})),this.renderHost}cleanupHost(){var t;(t=this.renderHost)!=null&&t.isConnected&&this.renderHost.remove(),this.renderHost=null}collectStyles(){let t=[];document.querySelectorAll("style").forEach(i=>{let s=i.textContent;s&&s.trim()&&t.push(s)});let e=[];return document.querySelectorAll('link[rel="stylesheet"]').forEach(i=>{let s=i.href;s&&e.push(s)}),{css:t.join(`
`),links:e}}cssForInjection(){return this.cssCache===null&&(this.cssCache=this.collectStyles()),this.cssCache.css===this.injectedCss?null:(this.injectedCss=this.cssCache.css,this.cssCache.css)}linksForInjection(){this.cssCache===null&&(this.cssCache=this.collectStyles());let t=this.cssCache.links;return t.length===this.injectedLinks.length&&t.every((e,i)=>e===this.injectedLinks[i])?this.injectedLinks:(this.injectedLinks=t,t)}themeClass(){return document.body.classList.contains("theme-light")?"theme-light":"theme-dark"}themeBackground(){let t=getComputedStyle(document.body).backgroundColor;return t&&t!=="rgba(0, 0, 0, 0)"&&t!=="transparent"?t:"#1e1e1e"}initialBounds(){let t=this.plugin.settings,e=u(Math.round(t.width),220,1600),i=u(Math.round(t.height),180,1600),s=m(),n=s==null?void 0:s.screen;if(t.x===null||t.y===null){let o=n?n.getPrimaryDisplay().workArea:{x:0,y:0,width:window.screen.availWidth,height:window.screen.availHeight};return{x:o.x+o.width-e-24,y:o.y+o.height-i-24,width:e,height:i}}let r=t.x,a=t.y;if(n){let c=n.getDisplayNearestPoint({x:r,y:a}).workArea;r=u(r,c.x,c.x+c.width-e),a=u(a,c.y,c.y+c.height-i)}return{x:r,y:a,width:e,height:i}}onMove(){this.isOpen()&&(this.hidden||this.busy||Date.now()<this.suppressUntil||(this.moveTimer&&window.clearTimeout(this.moveTimer),this.moveTimer=window.setTimeout(()=>{this.moveTimer=null,this.afterUserMove()},300)))}async afterUserMove(){if(!this.isOpen()||this.hidden||(this.savePosition(),!this.plugin.settings.snapAutoHide))return;let t=this.detectEdge();t&&await this.collapseToEdge(t)}onResize(){this.isOpen()&&(Date.now()<this.suppressUntil||(this.resizeTimer&&window.clearTimeout(this.resizeTimer),this.resizeTimer=window.setTimeout(()=>{if(this.resizeTimer=null,!this.isOpen())return;let t=this.win.getBounds(),e=this.plugin.settings;Math.abs(t.width-e.width)<=4&&Math.abs(t.height-e.height)<=4||(e.width=t.width,e.height=t.height,this.plugin.saveSettings(),this.scheduleRender(180))},300)))}savePosition(){if(!this.isOpen())return;let t=this.win.getBounds(),e=this.plugin.settings;e.x===t.x&&e.y===t.y||(e.x=t.x,e.y=t.y,this.plugin.saveSettings())}restoreSnappedState(){if(!this.isOpen()||!this.plugin.settings.snapAutoHide)return;let t=this.detectEdge();t&&(this.snapEdge=t,this.hidden=!1,this.revealArmed=!0,this.startHoverWatch())}detectEdge(){if(!this.isOpen())return null;let t=this.win.getBounds(),e=this.workArea(t),i={left:Math.abs(t.x-e.x),right:Math.abs(e.x+e.width-(t.x+t.width)),top:Math.abs(t.y-e.y),bottom:Math.abs(e.y+e.height-(t.y+t.height))},s=null,n=U+1;return["left","right","top","bottom"].forEach(r=>{i[r]<n&&(n=i[r],s=r)}),s}workArea(t){let e=m(),i=e==null?void 0:e.screen;if(i!=null&&i.getDisplayMatching){let s=i.getDisplayMatching(t),n=s==null?void 0:s.workArea;if(n&&[n.x,n.y,n.width,n.height].every(r=>Number.isFinite(r)))return n}return{x:0,y:0,width:window.screen.availWidth,height:window.screen.availHeight}}flushBounds(t,e,i){switch(t){case"left":return{x:i.x,y:e.y};case"right":return{x:i.x+i.width-e.width,y:e.y};case"top":return{x:e.x,y:i.y};case"bottom":return{x:e.x,y:i.y+i.height-e.height}}return{x:e.x,y:e.y}}hiddenPosition(t,e,i){switch(t){case"left":return{x:i.x-e.width+g,y:e.y};case"right":return{x:i.x+i.width-g,y:e.y};case"top":return{x:e.x,y:i.y-e.height+g};case"bottom":return{x:e.x,y:i.y+i.height-g}}return{x:e.x,y:e.y}}async collapseToEdge(t){if(!(!this.isOpen()||this.busy)){this.busy=!0;try{let e=this.win.getBounds(),i=this.workArea(e);this.snapEdge=t;let s=this.flushBounds(t,e,i);await this.animateTo(s,120),this.plugin.settings.x=s.x,this.plugin.settings.y=s.y,this.plugin.saveSettings();let n=this.hiddenPosition(t,e,i);await this.animateTo(n,170),this.hidden=!0,this.revealArmed=!1,await this.exec(`window.__nwSetCollapsed && window.__nwSetCollapsed(true, '${t}')`),this.startHoverWatch()}finally{this.busy=!1}}}async expand(){if(!(!this.isOpen()||this.busy||!this.snapEdge)){this.busy=!0;try{await this.exec("window.__nwSetCollapsed && window.__nwSetCollapsed(false)");let t=this.win.getBounds(),e=this.workArea(t),i=this.flushBounds(this.snapEdge,t,e);this.hidden=!1,this.outsideTicks=0,this.revealArmed=!0,await this.animateTo(i,150)}finally{this.busy=!1}}}async collapseAgain(){if(!(!this.isOpen()||this.busy||!this.snapEdge)){this.busy=!0;try{let t=this.win.getBounds(),e=this.workArea(t),i=this.hiddenPosition(this.snapEdge,t,e);await this.animateTo(i,170),this.hidden=!0,this.revealArmed=!1,await this.exec(`window.__nwSetCollapsed && window.__nwSetCollapsed(true, '${this.snapEdge}')`)}finally{this.busy=!1}}}startHoverWatch(){this.hoverTimer||(this.outsideTicks=0,this.hoverTimer=window.setInterval(()=>this.hoverTick(),$))}stopHoverWatch(){this.hoverTimer&&(window.clearInterval(this.hoverTimer),this.hoverTimer=null),this.outsideTicks=0}hoverTick(){if(!this.isOpen()){this.stopHoverWatch();return}if(!this.plugin.settings.snapAutoHide||!this.snapEdge){this.stopHoverWatch();return}if(this.busy)return;let t=this.cursorPoint();if(t){if(this.hidden){let e=this.pointInRect(t,this.triggerRect(this.snapEdge));if(!this.revealArmed){e||(this.revealArmed=!0);return}e&&this.expand();return}if(this.pointInRect(t,this.inflateRect(this.win.getBounds(),10))){this.outsideTicks=0;return}this.outsideTicks+=1,this.outsideTicks>=q&&(this.outsideTicks=0,this.collapseAgain())}}triggerRect(t){let e=this.win.getBounds(),i=this.workArea(e),s=g+6;switch(t){case"left":return{x:i.x,y:e.y,width:s,height:e.height};case"right":return{x:i.x+i.width-s,y:e.y,width:s,height:e.height};case"top":return{x:e.x,y:i.y,width:e.width,height:s};case"bottom":return{x:e.x,y:i.y+i.height-s,width:e.width,height:s}}}inflateRect(t,e){return{x:t.x-e,y:t.y-e,width:t.width+e*2,height:t.height+e*2}}pointInRect(t,e){return t.x>=e.x&&t.x<=e.x+e.width&&t.y>=e.y&&t.y<=e.y+e.height}cursorPoint(){var i;let t=(i=m())==null?void 0:i.screen;if(!(t!=null&&t.getCursorScreenPoint))return null;let e=t.getCursorScreenPoint();return{x:e.x,y:e.y}}async animateTo(t,e){let i=this.win;if(!i||i.isDestroyed())return;if(!t||!Number.isFinite(t.x)||!Number.isFinite(t.y)){console.warn("[note-widget] \u5FFD\u7565\u65E0\u6548\u7684\u7A97\u53E3\u4F4D\u7F6E",t);return}this.animTimer&&(window.clearTimeout(this.animTimer),this.animTimer=null);let s=0,n=0;try{let h=i.getPosition();s=Number(h==null?void 0:h[0]),n=Number(h==null?void 0:h[1])}catch(h){return}if(!Number.isFinite(s)||!Number.isFinite(n))return;let r=this.plugin.settings,a=u(Math.round(r.width),220,1600),o=u(Math.round(r.height),180,1600);if(!Number.isFinite(a)||!Number.isFinite(o))try{let h=i.getBounds();a=h.width,o=h.height}catch(h){return}if(!Number.isFinite(a)||!Number.isFinite(o)||a<=0||o<=0||Math.abs(s-t.x)<1&&Math.abs(n-t.y)<1)return;this.suppressUntil=Date.now()+e+600;let c=Date.now();await new Promise(h=>{let x=()=>{if(this.animTimer=null,!this.isOpen()){h();return}let T=Math.min(1,(Date.now()-c)/e),k=1-Math.pow(1-T,3),R=Math.round(s+(t.x-s)*k),O=Math.round(n+(t.y-n)*k);try{this.win.setBounds({x:R,y:O,width:a,height:o},!1)}catch(H){console.warn("[note-widget] \u79FB\u52A8\u7A97\u53E3\u5931\u8D25",H),h();return}T<1?this.animTimer=window.setTimeout(x,16):h()};x()})}clearTimers(){this.renderTimer&&window.clearTimeout(this.renderTimer),this.moveTimer&&window.clearTimeout(this.moveTimer),this.resizeTimer&&window.clearTimeout(this.resizeTimer),this.animTimer&&window.clearTimeout(this.animTimer),this.renderTimer=null,this.moveTimer=null,this.resizeTimer=null,this.animTimer=null,this.stopHoverWatch()}async exec(t){if(this.isOpen())try{await this.win.webContents.executeJavaScript(t,!0)}catch(e){}}};var v=class extends p.Plugin{async onload(){await this.loadSettings(),this.widget=new f(this),this.addRibbonIcon("panel-top","\u6253\u5F00/\u5173\u95ED\u7B14\u8BB0\u5C0F\u90E8\u4EF6",()=>void this.widget.toggle()),this.addCommand({id:"toggle-note-widget",name:"\u6253\u5F00/\u5173\u95ED\u7B14\u8BB0\u5C0F\u90E8\u4EF6",callback:()=>void this.widget.toggle()}),this.addCommand({id:"refresh-note-widget",name:"\u5237\u65B0\u7B14\u8BB0\u5C0F\u90E8\u4EF6",callback:()=>void this.widget.render()}),this.addSettingTab(new w(this.app,this)),this.registerEvent(this.app.vault.on("modify",t=>{var e;t instanceof p.TFile&&t.path===((e=this.getTargetFile())==null?void 0:e.path)&&this.widget.scheduleRender()})),this.registerEvent(this.app.vault.on("rename",(t,e)=>{e!==this.settings.notePath||!(t instanceof p.TFile)||(this.settings.notePath=t.path,this.saveSettings(),this.widget.scheduleRender())})),this.registerEvent(this.app.vault.on("delete",t=>{t.path===this.settings.notePath&&this.widget.scheduleRender(0)})),this.app.workspace.onLayoutReady(()=>{this.settings.widgetVisible&&this.widget.open()})}onunload(){var t;(t=this.widget)==null||t.destroy(!0)}async loadSettings(){this.settings=Object.assign({},S,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}applySettings(){var t;(t=this.widget)==null||t.applySettings()}getTargetFile(){var r,a;let t=((r=this.settings.notePath)!=null?r:"").trim();if(!t)return null;let e=t.replace(/^\/+/,""),i=e.toLowerCase().endsWith(".md")?[e]:[e,`${e}.md`];for(let o of i){let c=this.app.vault.getAbstractFileByPath(o);if(c instanceof p.TFile)return c}let s=this.app.metadataCache.getFirstLinkpathDest(e,"");if(s)return s;let n=e.toLowerCase();return(a=this.app.vault.getMarkdownFiles().find(o=>o.path.toLowerCase()===n||o.basename.toLowerCase()===n))!=null?a:null}};
