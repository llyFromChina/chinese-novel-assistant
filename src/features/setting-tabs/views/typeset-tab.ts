import { Setting } from "obsidian";
import { LocalizationConstants } from "../../../utils/localization-constants";
import { createSettingsSectionHeading } from "./heading";
import type { SettingsTabRenderContext } from "./types";

export function renderTypesetSettings(containerEl: HTMLElement, deps: SettingsTabRenderContext): void {
	const { ctx, refresh } = deps;
	const panelEl = containerEl.createDiv({ cls: "cna-settings-panel" });
	createSettingsSectionHeading(panelEl, LocalizationConstants.settings.typeset.section.typeset);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.typeset.enable.name)
		.setDesc(LocalizationConstants.settings.typeset.enable.desc)
		.setClass("cna-settings-item")
		.addToggle((toggle) =>
			toggle.setValue(ctx.settings.typesetEnabled).onChange(async (value) => {
				await ctx.setSettings({ typesetEnabled: value });
				refresh();
			}),
		);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.typeset.indent.name)
		.setDesc(LocalizationConstants.settings.typeset.indent.desc)
		.setClass("cna-settings-item")
		.setDisabled(!ctx.settings.typesetEnabled)
		.addSlider((slider) =>
			slider
				.setLimits(0, 6, 1)
				.setValue(ctx.settings.typesetIndentChars)
				.setDynamicTooltip()
				.setDisabled(!ctx.settings.typesetEnabled)
				.onChange(async (value) => {
					await ctx.setSettings({ typesetIndentChars: Math.round(value) });
				}),
		);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.typeset.line_spacing.name)
		.setDesc(LocalizationConstants.settings.typeset.line_spacing.desc)
		.setClass("cna-settings-item")
		.setDisabled(!ctx.settings.typesetEnabled)
		.addSlider((slider) =>
			slider
				.setLimits(0, 4, 0.1)
				.setValue(ctx.settings.typesetLineSpacing)
				.setDynamicTooltip()
				.setDisabled(!ctx.settings.typesetEnabled)
				.onChange(async (value) => {
					await ctx.setSettings({ typesetLineSpacing: Number(value.toFixed(1)) });
				}),
		);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.typeset.paragraph_spacing.name)
		.setDesc(LocalizationConstants.settings.typeset.paragraph_spacing.desc)
		.setClass("cna-settings-item")
		.setDisabled(!ctx.settings.typesetEnabled)
		.addSlider((slider) =>
			slider
				.setLimits(0, 32, 1)
				.setValue(ctx.settings.typesetParagraphSpacing)
				.setDynamicTooltip()
				.setDisabled(!ctx.settings.typesetEnabled)
				.onChange(async (value) => {
					await ctx.setSettings({ typesetParagraphSpacing: Math.round(value) });
				}),
		);

	createSettingsSectionHeading(panelEl, LocalizationConstants.settings.typeset.section.beautify);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.typeset.beautify.heading_icon.name)
		.setDesc(LocalizationConstants.settings.typeset.beautify.heading_icon.desc)
		.setClass("cna-settings-item")
		.addToggle((toggle) =>
			toggle.setValue(ctx.settings.typesetShowHeadingIcons).onChange(async (value) => {
				await ctx.setSettings({ typesetShowHeadingIcons: value });
			}),
		);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.typeset.beautify.justify.name)
		.setDesc(LocalizationConstants.settings.typeset.beautify.justify.desc)
		.setClass("cna-settings-item")
		.addToggle((toggle) =>
			toggle.setValue(ctx.settings.typesetJustifyText).onChange(async (value) => {
				await ctx.setSettings({ typesetJustifyText: value });
			}),
		);
}
