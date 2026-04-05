import {Plugin} from "obsidian";
import {EditorView, type ViewUpdate} from "@codemirror/view";

import {type PluginContext} from "../../core";
import {createHeadingIconExtension} from "./heading-icons";

const TYPESET_ENABLED_ATTR = "data-cna-typeset";
const TYPESET_HEADING_ICONS_ATTR = "data-cna-heading-icons";
const TYPESET_JUSTIFY_ATTR = "data-cna-justify";

const INDENT_CHARS_VAR = "--cna-indent-chars";
const LINE_SPACING_VAR = "--cna-line-spacing";
const PARAGRAPH_SPACING_VAR = "--cna-paragraph-spacing";

export function registerTypesetFeature(plugin: Plugin, ctx: PluginContext): void {
	const feature = new TypesetFeature(plugin, ctx);
	feature.onload();
}

class TypesetFeature {
	private plugin: Plugin;
	private ctx: PluginContext;
	private renderTimer: number | null = null;
	private isUnloaded = false;

	constructor(plugin: Plugin, ctx: PluginContext) {
		this.plugin = plugin;
		this.ctx = ctx;
	}

	onload(): void {
		this.plugin.registerEditorExtension(createHeadingIconExtension());
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("layout-change", () => {
				this.scheduleApply();
			}),
		);
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("editor-change", () => {
				this.scheduleApply();
			}),
		);
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("file-open", () => {
				this.scheduleApply();
			}),
		);
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("active-leaf-change", () => {
				this.scheduleApply();
			}),
		);
		this.plugin.registerEditorExtension(
			EditorView.updateListener.of((update: ViewUpdate) => {
				if (update.docChanged || update.viewportChanged || update.geometryChanged || update.focusChanged || update.selectionSet) {
					this.scheduleApply();
				}
			}),
		);

		const unsubscribeSettingsChange = this.ctx.onSettingsChange(() => {
			this.scheduleApply();
		});
		this.plugin.register(() => {
			unsubscribeSettingsChange();
		});

		this.plugin.register(() => {
			this.isUnloaded = true;
			if (this.renderTimer !== null) {
				window.clearTimeout(this.renderTimer);
				this.renderTimer = null;
			}
			this.clear();
		});

		this.scheduleApply();
	}

	private scheduleApply(): void {
		if (this.isUnloaded) {
			return;
		}
		if (this.renderTimer !== null) {
			window.clearTimeout(this.renderTimer);
		}
		this.renderTimer = window.setTimeout(() => {
			this.renderTimer = null;
			this.apply();
		}, 60);
	}

	private apply(): void {
		const settings = this.ctx.settings;
		const rootEl = this.getRootEl();

		// 检查当前打开的文件是否在正文目录中
		const activeFile = this.plugin.app.workspace.getActiveFile();
		const isInNovelDir = activeFile && settings.novelCustomDir && this.ctx.novelLibraryService.isPathInCustomDir(activeFile.path, settings.novelCustomDir);

		// 只有在排版功能启用且文件在正文目录中时才应用排版
		const shouldApplyTypeset = settings.typesetEnabled && isInNovelDir;

		rootEl.setAttribute(TYPESET_ENABLED_ATTR, shouldApplyTypeset ? "on" : "off");
		rootEl.setAttribute(TYPESET_HEADING_ICONS_ATTR, shouldApplyTypeset && settings.typesetShowHeadingIcons ? "on" : "off");
		rootEl.setAttribute(TYPESET_JUSTIFY_ATTR, shouldApplyTypeset && settings.typesetJustifyText ? "on" : "off");

		rootEl.style.setProperty(INDENT_CHARS_VAR, String(Math.max(0, settings.typesetIndentChars)));
		rootEl.style.setProperty(LINE_SPACING_VAR, String(Math.max(0, settings.typesetLineSpacing)));
		rootEl.style.setProperty(PARAGRAPH_SPACING_VAR, `${Math.max(0, settings.typesetParagraphSpacing)}px`);
	}

	private clear(): void {
		const rootEl = this.getRootEl();
		rootEl.removeAttribute(TYPESET_ENABLED_ATTR);
		rootEl.removeAttribute(TYPESET_HEADING_ICONS_ATTR);
		rootEl.removeAttribute(TYPESET_JUSTIFY_ATTR);
		rootEl.style.removeProperty(INDENT_CHARS_VAR);
		rootEl.style.removeProperty(LINE_SPACING_VAR);
		rootEl.style.removeProperty(PARAGRAPH_SPACING_VAR);
	}

	private getRootEl(): HTMLElement {
		const workspaceContainerEl = (this.plugin.app.workspace as unknown as { containerEl?: HTMLElement }).containerEl;
		return workspaceContainerEl ?? document.body;
	}
}
