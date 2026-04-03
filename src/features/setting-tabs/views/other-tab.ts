import { Setting } from "obsidian";
import { DEFAULT_CHAPTER_NAME_FORMAT } from "../../../core";
import { LocalizationConstants } from "../../../utils/localization-constants";
import { createSettingsSectionHeading } from "./heading";
import type { SettingsTabRenderContext } from "./types";

export function renderOtherSettings(containerEl: HTMLElement, deps: SettingsTabRenderContext): void {
	const { ctx, refresh } = deps;
	const panelEl = containerEl.createDiv({ cls: "cna-settings-panel" });
	createSettingsSectionHeading(panelEl, LocalizationConstants.settings.other.section.common);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.other.open_file_in_new_tab.name)
		.setDesc(LocalizationConstants.settings.other.open_file_in_new_tab.desc)
		.setClass("cna-settings-item")
		.addToggle((toggle) =>
			toggle.setValue(ctx.settings.openFileInNewTab).onChange(async (value) => {
				await ctx.setSettings({ openFileInNewTab: value });
			}),
		);

	createSettingsSectionHeading(panelEl, LocalizationConstants.settings.other.section.word_count);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.other.enable_character_count.name)
		.setDesc(LocalizationConstants.settings.other.enable_character_count.desc)
		.setClass("cna-settings-item")
		.addToggle((toggle) =>
			toggle.setValue(ctx.settings.enableCharacterCount).onChange(async (value) => {
				await ctx.setSettings({ enableCharacterCount: value });
				refresh();
				}),
		);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.other.enable_character_milestone.name)
		.setDesc(LocalizationConstants.settings.other.enable_character_milestone.desc)
		.setClass("cna-settings-item")
		.setDisabled(!ctx.settings.enableCharacterCount)
		.addToggle((toggle) =>
			toggle
				.setValue(ctx.settings.enableCharacterMilestone)
				.setDisabled(!ctx.settings.enableCharacterCount)
				.onChange(async (value) => {
					await ctx.setSettings({ enableCharacterMilestone: value });
				}),
		);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.other.count_only_novel_library.name)
		.setDesc(LocalizationConstants.settings.other.count_only_novel_library.desc)
		.setClass("cna-settings-item")
		.setDisabled(!ctx.settings.enableCharacterCount)
		.addToggle((toggle) =>
			toggle
				.setValue(ctx.settings.countOnlyNovelLibrary)
				.setDisabled(!ctx.settings.enableCharacterCount)
				.onChange(async (value) => {
					await ctx.setSettings({ countOnlyNovelLibrary: value });
				}),
		);

	createSettingsSectionHeading(panelEl, LocalizationConstants.settings.other.section.generate_chapter);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.other.chapter_name_format.name)
		.setDesc(LocalizationConstants.settings.other.chapter_name_format.desc)
		.setClass("cna-settings-item")
		.addText((text) =>
			text
				.setPlaceholder(DEFAULT_CHAPTER_NAME_FORMAT)
				.setValue(resolveChapterNameFormat(ctx.settings.chapterNameFormat))
				.onChange(async (value) => {
					await ctx.setSettings({
						chapterNameFormat: resolveChapterNameFormat(value),
					});
				}),
		);

	createSettingsSectionHeading(panelEl, LocalizationConstants.settings.other.section.timeline);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.other.timeline.enable.name)
		.setDesc(LocalizationConstants.settings.other.timeline.enable.desc)
		.setClass("cna-settings-item")
		.addToggle((toggle) =>
			toggle.setValue(ctx.settings.timelineEnabled).onChange(async (value) => {
				await ctx.setSettings({ timelineEnabled: value });
			}),
		);
}

function resolveChapterNameFormat(rawValue: string): string {
	return rawValue.length > 0 ? rawValue : DEFAULT_CHAPTER_NAME_FORMAT;
}
