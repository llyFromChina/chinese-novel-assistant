import type {Extension} from "@codemirror/state";
import {type Plugin} from "obsidian";

import {NovelLibraryService, type SettingDatas} from "../../../core";
import {createSharedAutocompleteExt, resolveLineSuffixTriggerMatch} from "./shared-autocomplete";
import {type SnippetFragment, SnippetFragmentService} from "../text-fragment-parser";

import {resolveFilePathByEditorView} from "../../../utils";

const CURSOR_PLACEHOLDER = "{$cursor}";

export function createTextFragmentAutocompleteExt(
	plugin: Plugin,
	getSettings: () => SettingDatas,
): Extension {
	const snippetFragmentService = SnippetFragmentService.getInstance(plugin.app);
	const novelLibraryService = new NovelLibraryService(plugin.app);

	// 面板与刷新生命周期由 shared-autocomplete 统一处理；此文件只提供策略钩子。
	return createSharedAutocompleteExt<SnippetFragment, { libraryPath: string }>({
		getSettings,
		isEnabled: (settings) => settings.snippetTextFragmentEnabled,
		// 在当前行尾使用 //<query> 触发补全，仅匹配字母数字关键字。
		resolveTriggerMatch: (view) => resolveLineSuffixTriggerMatch(view, /\/\/([A-Za-z0-9]+)$/),
		resolveContext: (view, settings) => {
			const filePath = resolveFilePathByEditorView(plugin.app, view);
			if (!filePath) {
				return null;
			}
			return resolveLibraryContext(filePath, settings, novelLibraryService);
		},
		// 基于所属小说库与查询词检索片段候选。
		queryCandidates: ({ settings, match, context }) =>
			snippetFragmentService.querySnippetFragments({
				settings,
				libraryPath: context.libraryPath,
				query: match.query,
			}),
		getItemKey: (item, index) => `${item.keyword}-${index}`,
		getItemLabel: (item) => item.content,
		resolveInsertion: (item) => resolveInsertion(item.content),
		emptyTextKey: "feature.snippet.candidate.empty",
	});
}

function resolveLibraryContext(
	filePath: string,
	settings: SettingDatas,
	novelLibraryService: NovelLibraryService,
): { libraryPath: string } | null {
	// 根据文件路径定位其所属自定义目录。
	const snippetCustomDir = settings.snippetCustomDir;
	if (!snippetCustomDir) {
		return null;
	}

	const normalizedSnippetDir = novelLibraryService.normalizeVaultPath(snippetCustomDir);
	if (!normalizedSnippetDir) {
		return null;
	}

	// 位于功能库目录内时不触发片段补全，避免在源数据区触发替换。
	if (novelLibraryService.isInFeatureRoot(filePath, settings)) {
		return null;
	}

	return { libraryPath: normalizedSnippetDir };
}

function resolveInsertion(content: string): { insertText: string; cursorOffset: number } {
	const firstPlaceholderIndex = content.indexOf(CURSOR_PLACEHOLDER);
	if (firstPlaceholderIndex < 0) {
		return {
			insertText: content,
			cursorOffset: content.length,
		};
	}

	// 删除占位符文本，并把光标放在首个占位符原位置。
	return {
		insertText: content.split(CURSOR_PLACEHOLDER).join(""),
		cursorOffset: firstPlaceholderIndex,
	};
}
