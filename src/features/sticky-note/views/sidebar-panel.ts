import {NovelLibraryService, type PluginContext, type SettingDatas, UI} from "../../../core";
import {type EventRef, MarkdownView, Notice, setIcon, type TAbstractFile, TFile, TFolder} from "obsidian";
import {LocalizationConstants} from "../../../utils/localization-constants";
import {getLocalizedString} from "../../../utils/localization-helper";
import {ClearableInputComponent, showContextMenuAtMouseEvent} from "../../../ui";
import {createStickyNoteCardList} from "./card-list";
import type {StickyNoteSortMode, StickyNoteViewOptions} from "./types";
import {StickyNoteRepository} from "../repository";
import {areStringArraysEqual} from "../../../utils";

type StickyNoteSparklesTooltipKey = "feature.sticky_note.action.sparkles.tooltip";
type StickyNoteSortTooltipKey =
	| "feature.sticky_note.sort.tooltip.desc"
	| "feature.sticky_note.sort.tooltip.asc";

const STICKY_NOTE_SORT_MENU_SECTION = "cna-sticky-note-sort";

export function renderStickyNoteSidebarPanel(containerEl: HTMLElement, ctx: PluginContext): () => void {
	const rootEl = containerEl.createDiv({ cls: "cna-right-sidebar-guidebook" });
	const headerEl = rootEl.createDiv({ cls: "cna-right-sidebar-guidebook__header" });
	headerEl.createDiv({ cls: "cna-right-sidebar-guidebook__header-spacer" });

	const titleEl = headerEl.createDiv({ cls: "cna-right-sidebar-guidebook__title" });
	const titleIconEl = titleEl.createSpan({ cls: "cna-right-sidebar-guidebook__title-icon" });
	setIcon(titleIconEl, UI.ICON.STICKY_NOTE);
	const titleTextEl = titleEl.createSpan({
		cls: "cna-right-sidebar-guidebook__title-text",
	});

	const actionButtonEl = headerEl.createEl("button", {
		cls: "cna-right-sidebar-guidebook__toggle-button",
		attr: {
			type: "button",
		},
	});
	setIcon(actionButtonEl, UI.ICON.SPARKLES);

	rootEl.createDiv({ cls: "cna-right-sidebar-guidebook__divider" });
	const contentEl = rootEl.createDiv({ cls: "cna-right-sidebar-sticky-note__content" });
	const toolbarEl = contentEl.createDiv({ cls: "cna-right-sidebar-sticky-note__toolbar" });
	const searchWrapEl = toolbarEl.createDiv({ cls: "cna-right-sidebar-sticky-note__search-wrap" });
	const listWrapEl = contentEl.createDiv({ cls: "cna-right-sidebar-sticky-note__list-wrap" });
	let noteCountEl: HTMLElement | null = null;

	let sortMode: StickyNoteSortMode = "created_desc";
	let searchKeyword = "";
	const novelLibraryService = new NovelLibraryService(ctx.app);
	const repository = new StickyNoteRepository(ctx.app);
	let stickyNoteRootPaths = resolveScopedStickyNoteRootPaths(ctx, novelLibraryService);
	let lastScopeReferencePath: string | null = ctx.app.workspace.getActiveFile()?.path ?? null;

	const resolveViewOptions = (): StickyNoteViewOptions => {
		const settings = ctx.settings;
		return {
			defaultRows: settings.stickyNoteDefaultRows,
			tagHintTextEnabled: settings.stickyNoteTagHintTextEnabled,
		};
	};

	const cardList = createStickyNoteCardList({
		app: ctx.app,
		containerEl: listWrapEl,
		t: (key) => getLocalizedString(key),
		getSettings: () => ctx.settings,
		getStickyNoteRootPaths: () => stickyNoteRootPaths,
		onVisibleCountChange: (stats) => {
			const total = Math.max(0, stats.total);
			const visible = Math.max(0, stats.visible);
			const hasFilter = searchKeyword.trim().length > 0;
			noteCountEl?.setText(hasFilter ? `${visible}/${total}` : `${total}`);
		},
		initialSortMode: sortMode,
		initialSearchKeyword: searchKeyword,
		initialViewOptions: resolveViewOptions(),
	});
	const isStickyNoteMarkdownPath = (path: string): boolean => {
		if (!path || !path.toLowerCase().endsWith(".md")) {
			return false;
		}
		return stickyNoteRootPaths.some((rootPath) => novelLibraryService.isSameOrChildPath(path, rootPath));
	};
	const onVaultFileChanged = (file: TAbstractFile): void => {
		if (!(file instanceof TFile)) {
			return;
		}
		if (!isStickyNoteMarkdownPath(file.path)) {
			return;
		}
		cardList.applyVaultFileCreateOrModify(file.path);
	};
	const onVaultFileDeleted = (file: TAbstractFile): void => {
		if (!(file instanceof TFile)) {
			return;
		}
		if (!isStickyNoteMarkdownPath(file.path)) {
			return;
		}
		cardList.applyVaultFileDelete(file.path);
	};
	const isLibraryFolderRename = (nextPath: string, previousPath: string): boolean => {
		const normalizedNextPath = novelLibraryService.normalizeVaultPath(nextPath);
		const normalizedPreviousPath = novelLibraryService.normalizeVaultPath(previousPath);
		if (!normalizedNextPath || !normalizedPreviousPath || normalizedNextPath === normalizedPreviousPath) {
			return false;
		}
		const stickyNoteCustomDir = ctx.settings.stickyNoteCustomDir;
		if (!stickyNoteCustomDir) {
			return false;
		}
		const libraryRoots = [stickyNoteCustomDir];
		return libraryRoots.some((libraryRoot) =>
			novelLibraryService.isSameOrChildPath(libraryRoot, normalizedPreviousPath) ||
			novelLibraryService.isSameOrChildPath(normalizedPreviousPath, libraryRoot) ||
			novelLibraryService.isSameOrChildPath(libraryRoot, normalizedNextPath) ||
			novelLibraryService.isSameOrChildPath(normalizedNextPath, libraryRoot),
		);
	};
	const onVaultFileRenamed = (file: TAbstractFile, oldPath: string): void => {
		if (file instanceof TFolder) {
			if (isLibraryFolderRename(file.path, oldPath)) {
				refreshStickyNoteScope(file.path);
			}
			return;
		}
		const nextPath = file instanceof TFile && isStickyNoteMarkdownPath(file.path) ? file.path : "";
		const oldPathMatched = isStickyNoteMarkdownPath(oldPath);
		if (!nextPath && !oldPathMatched) {
			return;
		}
		if (nextPath && oldPathMatched) {
			cardList.applyVaultFileRename(oldPath, nextPath);
			return;
		}
		if (nextPath) {
			cardList.applyVaultFileCreateOrModify(nextPath);
			return;
		}
		cardList.applyVaultFileDelete(oldPath);
	};
	const vaultEventRefs: EventRef[] = [
		ctx.app.vault.on("create", onVaultFileChanged),
		ctx.app.vault.on("modify", onVaultFileChanged),
		ctx.app.vault.on("delete", onVaultFileDeleted),
		ctx.app.vault.on("rename", onVaultFileRenamed),
	];

	new ClearableInputComponent({
		containerEl: searchWrapEl,
		containerClassName: "cna-sticky-note-search-input-container",
		placeholder: "",
		onChange: (value) => {
			searchKeyword = value;
			cardList.setSearchKeyword(value);
		},
	});
	const searchInputContainerEl = searchWrapEl.querySelector<HTMLElement>(".cna-sticky-note-search-input-container");
	noteCountEl = searchInputContainerEl?.createSpan({
		cls: "cna-sticky-note-search-count",
		text: "0",
	}) ?? null;
	const searchInputEl = searchWrapEl.querySelector<HTMLInputElement>("input");
	const searchClearButtonEl = searchWrapEl.querySelector<HTMLElement>(".search-input-clear-button");

	const sortButtonEl = toolbarEl.createEl("button", {
		cls: "cna-right-sidebar-sticky-note__sort-button",
		attr: {
			type: "button",
		},
	});

	const updateSortButton = () => {
		sortButtonEl.empty();
		const iconName =
			sortMode === "created_desc" || sortMode === "modified_desc"
				? UI.ICON.CALENDAR_ARROW_DOWN
				: UI.ICON.CALENDAR_ARROW_UP;
		setIcon(sortButtonEl, iconName);
		sortButtonEl.setAttr("aria-label", getLocalizedString(getSortDirectionTooltipKey(sortMode)));
	};

	const updateLocalizedText = () => {
		updateTitleText();
		actionButtonEl.setAttr("aria-label", getLocalizedString(getSparklesTooltipKey()));
		searchInputEl?.setAttr("placeholder", LocalizationConstants.feature.sticky_note.search.placeholder);
		searchClearButtonEl?.setAttr("aria-label", LocalizationConstants.feature.sticky_note.search.clear);
		updateSortButton();
		cardList.rerender();
	};

	const createStickyNote = async (): Promise<void> => {
		const stickyRootPath = resolveTargetStickyNoteRootPath(ctx, novelLibraryService);
		if (!stickyRootPath) {
		new Notice(LocalizationConstants.command.sticky_note.create.no_library);
		return;
	}
	try {
		const file = await repository.createCardFile(stickyRootPath);
		cardList.applyVaultFileCreateOrModify(file.path);
	} catch (error) {
		console.error("[Chinese Novel Assistant] Failed to create sticky note.", error);
		new Notice(LocalizationConstants.command.sticky_note.create.failed);
	}
	};

	const updateTitleText = (preferredFilePath?: string | null): void => {
		titleTextEl.setText(resolveCurrentNovelLibraryName(ctx, novelLibraryService, preferredFilePath));
	};

	const refreshStickyNoteScope = (preferredFilePath?: string | null): void => {
		const activeFilePath = ctx.app.workspace.getActiveFile()?.path ?? null;
		const referencePath = typeof preferredFilePath === "string" && preferredFilePath.length > 0
			? preferredFilePath
			: (activeFilePath ?? lastScopeReferencePath);
		if (referencePath) {
			lastScopeReferencePath = referencePath;
		}
		updateTitleText(referencePath);
		const nextRoots = resolveScopedStickyNoteRootPaths(ctx, novelLibraryService, referencePath);
		if (areStringArraysEqual(stickyNoteRootPaths, nextRoots)) {
			return;
		}
		stickyNoteRootPaths = nextRoots;
		cardList.refresh();
	};

	const openSortMenu = (event: MouseEvent): void => {
		showContextMenuAtMouseEvent(event, [
			{
			title: LocalizationConstants.feature.sticky_note.sort.created_desc,
			icon: UI.ICON.CALENDAR_ARROW_DOWN,
			checked: sortMode === "created_desc",
			section: STICKY_NOTE_SORT_MENU_SECTION,
			onClick: () => {
				sortMode = "created_desc";
				updateSortButton();
				cardList.setSortMode(sortMode);
			},
		},
		{
			title: LocalizationConstants.feature.sticky_note.sort.created_asc,
			icon: UI.ICON.CALENDAR_ARROW_UP,
			checked: sortMode === "created_asc",
			section: STICKY_NOTE_SORT_MENU_SECTION,
			onClick: () => {
				sortMode = "created_asc";
				updateSortButton();
				cardList.setSortMode(sortMode);
			},
		},
		{ kind: "separator" },
		{
			title: LocalizationConstants.feature.sticky_note.sort.modified_desc,
			icon: UI.ICON.CALENDAR_ARROW_DOWN,
			checked: sortMode === "modified_desc",
			section: STICKY_NOTE_SORT_MENU_SECTION,
			onClick: () => {
				sortMode = "modified_desc";
				updateSortButton();
				cardList.setSortMode(sortMode);
			},
		},
		{
			title: LocalizationConstants.feature.sticky_note.sort.modified_asc,
			icon: UI.ICON.CALENDAR_ARROW_UP,
			checked: sortMode === "modified_asc",
			section: STICKY_NOTE_SORT_MENU_SECTION,
			onClick: () => {
				sortMode = "modified_asc";
				updateSortButton();
				cardList.setSortMode(sortMode);
			},
		},
		]);
	};
	sortButtonEl.addEventListener("click", openSortMenu);
	const onCreateClick = (): void => {
		void createStickyNote();
	};
	actionButtonEl.addEventListener("click", onCreateClick);
	const workspaceEventRefs: EventRef[] = [
		ctx.app.workspace.on("file-open", (file) => {
			refreshStickyNoteScope(file?.path ?? null);
		}),
		ctx.app.workspace.on("active-leaf-change", (leaf) => {
			const markdownView = leaf?.view;
			if (!(markdownView instanceof MarkdownView)) {
				return;
			}
			refreshStickyNoteScope(markdownView.file?.path ?? null);
		}),
	];
	updateLocalizedText();
	const disposeSettingsChange = ctx.onSettingsChange(() => {
		refreshStickyNoteScope();
		cardList.setViewOptions(resolveViewOptions());
		updateLocalizedText();
	});

	return () => {
		sortButtonEl.removeEventListener("click", openSortMenu);
		actionButtonEl.removeEventListener("click", onCreateClick);
		for (const ref of vaultEventRefs) {
			ctx.app.vault.offref(ref);
		}
		for (const ref of workspaceEventRefs) {
			ctx.app.workspace.offref(ref);
		}
		disposeSettingsChange();
		cardList.destroy();
	};
}

function resolveStickyNoteRootPaths(
	settings: SettingDatas,
	novelLibraryService: NovelLibraryService,
): string[] {
	const stickyNoteCustomDir = settings.stickyNoteCustomDir;
	if (!stickyNoteCustomDir) {
		return [];
	}
	const normalizedPath = novelLibraryService.normalizeVaultPath(stickyNoteCustomDir);
	return normalizedPath ? [normalizedPath] : [];
}

function resolveScopedStickyNoteRootPaths(
	ctx: PluginContext,
	novelLibraryService: NovelLibraryService,
	preferredFilePath?: string | null,
): string[] {
	const settings = ctx.settings;
	const allRoots = resolveStickyNoteRootPaths(settings, novelLibraryService);
	// ÃƒÂ§Ã¢â‚¬ÂºÃ‚Â´ÃƒÂ¦Ã…Â½Ã‚Â¥ÃƒÂ¨Ã‚Â¿Ã¢â‚¬ÂÃƒÂ¥Ã¢â‚¬ÂºÃ…Â¾ÃƒÂ¦Ã¢â‚¬Â°Ã¢â€šÂ¬ÃƒÂ¦Ã…â€œÃ¢â‚¬Â°ÃƒÂ¤Ã‚Â¾Ã‚Â¿ÃƒÂ§Ã‚Â­Ã‚Â¾ÃƒÂ¦Ã‚Â Ã‚Â¹ÃƒÂ¨Ã‚Â·Ã‚Â¯ÃƒÂ¥Ã‚Â¾Ã¢â‚¬Å¾ÃƒÂ¯Ã‚Â¼Ã…â€™ÃƒÂ¥Ã¢â‚¬ÂºÃ‚Â ÃƒÂ¤Ã‚Â¸Ã‚ÂºÃƒÂ§Ã…Â½Ã‚Â°ÃƒÂ¥Ã…â€œÃ‚Â¨ÃƒÂ¥Ã‚ÂÃ‚ÂªÃƒÂ¦Ã…â€œÃ¢â‚¬Â°ÃƒÂ¤Ã‚Â¸Ã¢â€šÂ¬ÃƒÂ¤Ã‚Â¸Ã‚ÂªÃƒÂ§Ã¢â‚¬ÂºÃ‚Â®ÃƒÂ¥Ã‚Â½Ã¢â‚¬Â¢
	return allRoots;
}

function resolveTargetStickyNoteRootPath(
	ctx: PluginContext,
	novelLibraryService: NovelLibraryService,
): string | null {
	const settings = ctx.settings;
	const stickyNoteCustomDir = settings.stickyNoteCustomDir;
	if (!stickyNoteCustomDir) {
		return null;
	}
	const normalizedPath = novelLibraryService.normalizeVaultPath(stickyNoteCustomDir);
	return normalizedPath.length > 0 ? normalizedPath : null;
}

function resolveCurrentNovelLibraryName(
	ctx: PluginContext,
	novelLibraryService: NovelLibraryService,
	filePath?: string | null,
): string {
	const activeFilePath = typeof filePath === "string" && filePath.length > 0
		? filePath
		: (ctx.app.workspace.getActiveFile()?.path ?? "");
	if (!activeFilePath) {
		return LocalizationConstants.feature.guidebook.current_library.none;
	}
	const settings = ctx.settings;
	const stickyNoteCustomDir = settings.stickyNoteCustomDir;
	if (!stickyNoteCustomDir) {
		return LocalizationConstants.feature.guidebook.current_library.none;
	}
	const segments = stickyNoteCustomDir.split("/").filter((segment) => segment.length > 0);
	return segments[segments.length - 1] ?? stickyNoteCustomDir;
}

function getSparklesTooltipKey(): StickyNoteSparklesTooltipKey {
	return "feature.sticky_note.action.sparkles.tooltip";
}

function getSortDirectionTooltipKey(mode: StickyNoteSortMode): StickyNoteSortTooltipKey {
	switch (mode) {
		case "created_desc":
		case "modified_desc":
			return "feature.sticky_note.sort.tooltip.desc";
		case "created_asc":
		case "modified_asc":
			return "feature.sticky_note.sort.tooltip.asc";
		default:
			return "feature.sticky_note.sort.tooltip.desc";
	}
}
