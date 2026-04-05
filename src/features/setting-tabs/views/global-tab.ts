import {Setting} from "obsidian";
import {LocalizationConstants} from "../../../utils/localization-constants";
import type {SettingsTabRenderContext} from "./types";
import {attachDirectoryPicker} from "../../../ui/componets/directory-picker";

export function renderGlobalSettings(containerEl: HTMLElement, deps: SettingsTabRenderContext): void {
	const {app, ctx, refresh} = deps;
	const panelEl = containerEl.createDiv({cls: "cna-settings-panel"});

	// 添加提示框
	const infoBox = panelEl.createDiv({cls: "cna-settings-info-box"});
	infoBox.textContent = "未配置目录等于未开启相应功能，每个配置项可以选择多个目录！！！";
	infoBox.style.padding = "10px";
	infoBox.style.marginBottom = "15px";
	infoBox.style.backgroundColor = "rgb(252, 246, 237)";
	infoBox.style.borderRadius = "5px";
	infoBox.style.border = "1px solid rgb(252, 246, 237)";

	// 辅助函数：创建目录选择器
	function createDirectorySelector(
		settingName: string,
		settingDesc: string,
		currentValue: string,
		settingKey: keyof typeof ctx.settings,
		supportMultiple?: boolean
	) {
		const setting = new Setting(panelEl)
			.setName(settingName)
			.setDesc(settingDesc)
			.setClass("cna-settings-item");

		// 使用目录选择器
		attachDirectoryPicker(app, setting, {
			value: currentValue,
			onChange: async (value) => {
				console.log("目录选择器值变化. key:", settingKey, "value:", value);
				await ctx.setSettings({[settingKey]: value});
				refresh();
			},
			getValue: () => ctx.settings[settingKey] as string,
			supportMultiple: supportMultiple || false
		});
	}

	// 创建各个目录选择器
	createDirectorySelector(
		LocalizationConstants.settings.global.custom_dirs.novel.name,
		LocalizationConstants.settings.global.custom_dirs.novel.desc,
		ctx.settings.novelCustomDir,
		"novelCustomDir",
		true
	);

	createDirectorySelector(
		LocalizationConstants.settings.global.custom_dirs.guidebook.name,
		LocalizationConstants.settings.global.custom_dirs.guidebook.desc,
		ctx.settings.guidebookCustomDir,
		"guidebookCustomDir"
	);

	createDirectorySelector(
		LocalizationConstants.settings.global.custom_dirs.sticky_note.name,
		LocalizationConstants.settings.global.custom_dirs.sticky_note.desc,
		ctx.settings.stickyNoteCustomDir,
		"stickyNoteCustomDir"
	);

	createDirectorySelector(
		LocalizationConstants.settings.global.custom_dirs.annotation.name,
		LocalizationConstants.settings.global.custom_dirs.annotation.desc,
		ctx.settings.annotationCustomDir,
		"annotationCustomDir"
	);

	createDirectorySelector(
		LocalizationConstants.settings.global.custom_dirs.timeline.name,
		LocalizationConstants.settings.global.custom_dirs.timeline.desc,
		ctx.settings.timelineCustomDir,
		"timelineCustomDir"
	);

	createDirectorySelector(
		LocalizationConstants.settings.global.custom_dirs.snippet.name,
		LocalizationConstants.settings.global.custom_dirs.snippet.desc,
		ctx.settings.snippetCustomDir,
		"snippetCustomDir"
	);

	createDirectorySelector(
		LocalizationConstants.settings.global.custom_dirs.proofread_dictionary.name,
		LocalizationConstants.settings.global.custom_dirs.proofread_dictionary.desc,
		ctx.settings.proofreadDictionaryCustomDir,
		"proofreadDictionaryCustomDir"
	);
}
