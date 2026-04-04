import {Setting} from "obsidian";
import {LocalizationConstants} from "../../../utils/localization-constants";
import {createSettingsSectionHeading} from "./heading";
import type {SettingsTabRenderContext} from "./types";

export function renderGlobalSettings(containerEl: HTMLElement, deps: SettingsTabRenderContext): void {
	const { app, ctx, refresh } = deps;
	const panelEl = containerEl.createDiv({ cls: "cna-settings-panel" });
	createSettingsSectionHeading(panelEl, LocalizationConstants.settings.global.section.custom_dirs);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.global.custom_dirs.guidebook.name)
		.setDesc(LocalizationConstants.settings.global.custom_dirs.guidebook.desc)
		.setClass("cna-settings-item")
		.addText((text) => {
			text.setPlaceholder("例如：设定库")
			text.setValue(ctx.settings.guidebookCustomDir)
			text.onChange(async (value) => {
				await ctx.setSettings({ guidebookCustomDir: value.trim() });
				refresh();
			});
		});

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.global.custom_dirs.sticky_note.name)
		.setDesc(LocalizationConstants.settings.global.custom_dirs.sticky_note.desc)
		.setClass("cna-settings-item")
		.addText((text) => {
			text.setPlaceholder("例如：便签库")
			text.setValue(ctx.settings.stickyNoteCustomDir)
			text.onChange(async (value) => {
				await ctx.setSettings({ stickyNoteCustomDir: value.trim() });
				refresh();
			});
		});

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.global.custom_dirs.annotation.name)
		.setDesc(LocalizationConstants.settings.global.custom_dirs.annotation.desc)
		.setClass("cna-settings-item")
		.addText((text) => {
			text.setPlaceholder("例如：批注库")
			text.setValue(ctx.settings.annotationCustomDir)
			text.onChange(async (value) => {
				await ctx.setSettings({ annotationCustomDir: value.trim() });
				refresh();
			});
		});

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.global.custom_dirs.timeline.name)
		.setDesc(LocalizationConstants.settings.global.custom_dirs.timeline.desc)
		.setClass("cna-settings-item")
		.addText((text) => {
			text.setPlaceholder("例如：时间轴")
			text.setValue(ctx.settings.timelineCustomDir)
			text.onChange(async (value) => {
				await ctx.setSettings({ timelineCustomDir: value.trim() });
				refresh();
			});
		});

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.global.custom_dirs.snippet.name)
		.setDesc(LocalizationConstants.settings.global.custom_dirs.snippet.desc)
		.setClass("cna-settings-item")
		.addText((text) => {
			text.setPlaceholder("例如：片段库")
			text.setValue(ctx.settings.snippetCustomDir)
			text.onChange(async (value) => {
				await ctx.setSettings({ snippetCustomDir: value.trim() });
				refresh();
			});
		});

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.global.custom_dirs.proofread_dictionary.name)
		.setDesc(LocalizationConstants.settings.global.custom_dirs.proofread_dictionary.desc)
		.setClass("cna-settings-item")
		.addText((text) => {
			text.setPlaceholder("例如：纠错词库")
			text.setValue(ctx.settings.proofreadDictionaryCustomDir)
			text.onChange(async (value) => {
				await ctx.setSettings({ proofreadDictionaryCustomDir: value.trim() });
				refresh();
			});
		});
}
