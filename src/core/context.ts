import {type App, type PluginSettingTab} from "obsidian";
import {NovelLibraryService} from "./novel-library-service";
import type {SettingDatas} from "./setting-datas";
import type {SettingsChangeListener, SettingStore} from "./setting-store";

export interface ContextHost {
	app: App;
	addSettingTab(tab: PluginSettingTab): void;
	settingStore: SettingStore;
}

export interface PluginContext {
	readonly app: App;
	readonly novelLibraryService: NovelLibraryService;
	readonly settings: SettingDatas;
	addSettingTab(tab: PluginSettingTab): void;
	setSettings(patch: Partial<SettingDatas>): Promise<void>;
	onSettingsChange(listener: SettingsChangeListener): () => void;
}

export function createPluginContext(host: ContextHost): PluginContext {
	const novelLibraryService = new NovelLibraryService(host.app);
	return {
		app: host.app,
		novelLibraryService,
		get settings() {
			return host.settingStore.data;
		},
		addSettingTab: (tab) => host.addSettingTab(tab),
		setSettings: async (patch) => {
			host.settingStore.patch(patch);
			await host.settingStore.saveAndNotify();
		},
		onSettingsChange: (listener) => host.settingStore.subscribe(listener),
	};
}
