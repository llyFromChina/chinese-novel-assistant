import { Setting } from "obsidian";
import { LocalizationConstants } from "../../../utils/localization-constants";
import { createSettingsSectionHeading } from "./heading";
import type { SettingsTabRenderContext } from "./types";

export function renderAnnotationSettings(containerEl: HTMLElement, deps: SettingsTabRenderContext): void {
	const { ctx, refresh } = deps;
	const panelEl = containerEl.createDiv({ cls: "cna-settings-panel" });
	createSettingsSectionHeading(panelEl, LocalizationConstants.settings.annotation.section.main);

	new Setting(panelEl)
		.setName(LocalizationConstants.settings.annotation.enable.name)
		.setDesc(LocalizationConstants.settings.annotation.enable.desc)
		.setClass("cna-settings-item")
		.addToggle((toggle) =>
			toggle.setValue(ctx.settings.annotationEnabled).onChange(async (value) => {
				await ctx.setSettings({ annotationEnabled: value });
				refresh();
			}),
		);


	new Setting(panelEl)
		.setName(LocalizationConstants.settings.annotation.auto_locate.name)
		.setDesc(LocalizationConstants.settings.annotation.auto_locate.desc)
		.setClass("cna-settings-item")
		.setDisabled(!ctx.settings.annotationEnabled)
		.addToggle((toggle) =>
			toggle
				.setValue(ctx.settings.annotationAutoLocateOnFileSwitch)
				.setDisabled(!ctx.settings.annotationEnabled)
				.onChange(async (value) => {
					await ctx.setSettings({ annotationAutoLocateOnFileSwitch: value });
				}),
		);
}
