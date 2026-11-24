/**
 * 小部件窗口自身的界面：外壳 HTML、外层样式和与插件通信的脚本。
 * 小部件是独立的 Electron 窗口，加载不到 Obsidian 的 styles.css，因此这里内联。
 */

const ICON_PIN = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>`;
const ICON_REFRESH = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v5h-5"/></svg>`;
const ICON_CLOSE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
const ICON_EDIT = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`;
const ICON_PICK = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;

const CHROME_CSS = `
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
/* 可点击勾选的任务复选框 */
#nw-root input[type="checkbox"][data-nw-task] { cursor: pointer; }
/* 窗口内的笔记选择面板：限制在窗口内部，列表自身滚动 */
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
/* 收起后只露出很窄的一条触发条：把标题栏涂成强调色作为提示 */
body.is-collapsed .nw-title, body.is-collapsed .nw-btn { display: none; }
body.is-collapsed .nw-header { border-bottom: none; background: var(--interactive-accent, #7c3aed); }
body.is-collapsed #nw-root { visibility: hidden; }
`;

const SHELL_SCRIPT = `
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
			empty.textContent = '没有匹配的笔记';
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
				badge.textContent = '当前';
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
			// 主题/核心样式放在内联样式之前，保证小部件自身的外壳规则可以覆盖
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
		var nextTitle = p.title || '笔记小部件';
		// 同一笔记的实时刷新保留阅读位置，只有切换笔记时才回到顶部
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
`;

export function buildShellDocument(): string {
	return `<!DOCTYPE html>
<html class="theme-dark">
<head>
<meta charset="utf-8" />
<style id="nw-app-css"></style>
<style id="nw-chrome-css">${CHROME_CSS}</style>
</head>
<body class="nw-body theme-dark">
<header class="nw-header">
	<span class="nw-title" id="nw-title">笔记小部件</span>
	<button class="nw-btn" type="button" data-nw-action="pick" title="选择笔记">${ICON_PICK}</button>
	<button class="nw-btn" type="button" data-nw-action="edit" title="在主窗口中编辑">${ICON_EDIT}</button>
	<button class="nw-btn" type="button" data-nw-action="pin" title="始终置顶">${ICON_PIN}</button>
	<button class="nw-btn" type="button" data-nw-action="refresh" title="刷新">${ICON_REFRESH}</button>
	<button class="nw-btn" type="button" data-nw-action="close" title="关闭小部件">${ICON_CLOSE}</button>
</header>
<main id="nw-root" class="markdown-preview-view markdown-rendered"></main>
<div id="nw-picker" class="nw-picker">
	<input id="nw-picker-input" class="nw-picker-input" type="text" placeholder="搜索笔记（文件名或路径）" spellcheck="false" autocomplete="off" />
	<div id="nw-picker-list" class="nw-picker-list"></div>
</div>
<div id="nw-banner" class="nw-banner"><span class="nw-banner-msg" id="nw-banner-msg"></span></div>
<script>${SHELL_SCRIPT}</script>
</body>
</html>`;
}
