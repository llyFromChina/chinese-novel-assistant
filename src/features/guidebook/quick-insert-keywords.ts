import {type App, type Plugin} from "obsidian";
import {buildGuidebookTreeData} from "./tree-builder";
import {collectGuidebookAliases} from "./alias-utils";
import {bindVaultChangeWatcher, NovelLibraryService, type SettingDatas} from "../../core";

export interface GuidebookQuickInsertCandidate {
	keyword: string;
	keywordLower: string;
}

interface GuidebookQuickInsertSnapshot {
	candidates: readonly GuidebookQuickInsertCandidate[];
}

interface QueryGuidebookQuickInsertOptions {
	settings: Pick<
		SettingDatas,
		"guidebookCustomDir" | "guidebookCollectionOrders" | "guidebookWesternNameAutoAliasEnabled"
	>;
	filePath: string;
	query: string;
}

export class GuidebookQuickInsertService {
	private static readonly INSTANCES = new WeakMap<App, GuidebookQuickInsertService>();

	private readonly app: App;
	private readonly novelLibraryService: NovelLibraryService;
	private initialized = false;
	private snapshots = new Map<string, GuidebookQuickInsertSnapshot>();
	private pendingSnapshots = new Map<string, Promise<GuidebookQuickInsertSnapshot>>();

	private constructor(app: App) {
		this.app = app;
		this.novelLibraryService = new NovelLibraryService(app);
	}

	static getInstance(app: App): GuidebookQuickInsertService {
		const existing = GuidebookQuickInsertService.INSTANCES.get(app);
		if (existing) {
			return existing;
		}
		const created = new GuidebookQuickInsertService(app);
		GuidebookQuickInsertService.INSTANCES.set(app, created);
		return created;
	}

	bindVaultEvents(plugin: Plugin, getSettings: () => SettingDatas): void {
		if (this.initialized) {
			return;
		}
		this.initialized = true;

		const onChangedPath = (path: string, oldPath?: string): void => {
			const settings = getSettings();
			const affectedLibraryRoots = new Set<string>();
			this.tryCollectGuidebookLibraryRoot(path, { guidebookCustomDir: settings.guidebookCustomDir }, affectedLibraryRoots);
			this.tryCollectGuidebookLibraryRoot(oldPath ?? "", { guidebookCustomDir: settings.guidebookCustomDir }, affectedLibraryRoots);
			for (const libraryRoot of affectedLibraryRoots) {
				this.invalidateByLibraryRoot({ guidebookCustomDir: settings.guidebookCustomDir }, libraryRoot);
			}
		};

		bindVaultChangeWatcher(plugin, this.app, (event) => {
			onChangedPath(event.path, event.oldPath);
		});

		plugin.register(() => {
			this.initialized = false;
			this.invalidateAll();
		});
	}

	invalidateAll(): void {
		this.snapshots.clear();
		this.pendingSnapshots.clear();
	}

	async queryGuidebookCandidates(options: QueryGuidebookQuickInsertOptions): Promise<GuidebookQuickInsertCandidate[]> {
		const normalizedQuery = options.query.trim().toLowerCase();
		if (!normalizedQuery) {
			return [];
		}

		const guidebookCustomDir = options.settings.guidebookCustomDir;
		if (!guidebookCustomDir) {
			return [];
		}

		const libraryRoot = guidebookCustomDir;
		const snapshot = await this.ensureSnapshot(options.settings, options.filePath, libraryRoot);
		return snapshot.candidates
			.filter((candidate) => candidate.keywordLower.includes(normalizedQuery))
			.slice()
			.sort((left, right) => this.compareByQuery(left, right, normalizedQuery));
	}

	private async ensureSnapshot(
		settings: QueryGuidebookQuickInsertOptions["settings"],
		filePath: string,
		libraryRoot: string,
	): Promise<GuidebookQuickInsertSnapshot> {
		const cacheKey = this.createCacheKey(settings, libraryRoot);
		const cached = this.snapshots.get(cacheKey);
		if (cached) {
			return cached;
		}

		const pending = this.pendingSnapshots.get(cacheKey);
		if (pending) {
			return pending;
		}

		const buildPromise = this.buildSnapshot(settings, filePath, libraryRoot)
			.then((built) => {
				this.snapshots.set(cacheKey, built);
				return built;
			})
			.finally(() => {
				this.pendingSnapshots.delete(cacheKey);
			});
		this.pendingSnapshots.set(cacheKey, buildPromise);
		return buildPromise;
	}

	private async buildSnapshot(
		settings: QueryGuidebookQuickInsertOptions["settings"],
		filePath: string,
		libraryRoot: string,
	): Promise<GuidebookQuickInsertSnapshot> {
		const treeData = await buildGuidebookTreeData(this.app, settings, filePath);
		if (!treeData || treeData.libraryRootPath !== libraryRoot) {
			return {
				candidates: [],
			};
		}

		const candidateByKeyword = new Map<string, GuidebookQuickInsertCandidate>();
		for (const fileNode of treeData.files) {
			for (const h1Node of fileNode.h1List) {
				for (const h2Node of h1Node.h2List) {
					const keyword = h2Node.title.trim();
					const aliases = collectGuidebookAliases({
						keyword,
						content: h2Node.content,
						enableWesternNameAutoAlias: settings.guidebookWesternNameAutoAliasEnabled,
					});
					for (const candidateKeyword of [keyword, ...aliases]) {
						const normalizedKeyword = candidateKeyword.trim();
						if (!normalizedKeyword || candidateByKeyword.has(normalizedKeyword)) {
							continue;
						}
						candidateByKeyword.set(normalizedKeyword, {
							keyword: normalizedKeyword,
							keywordLower: normalizedKeyword.toLowerCase(),
						});
					}
				}
			}
		}

		return {
			candidates: Array.from(candidateByKeyword.values()),
		};
	}

	private tryCollectGuidebookLibraryRoot(
		path: string,
		settings: Pick<SettingDatas, "guidebookCustomDir">,
		target: Set<string>,
	): void {
		const normalizedPath = this.novelLibraryService.normalizeVaultPath(path);
		if (!normalizedPath || !normalizedPath.toLowerCase().endsWith(".md")) {
			return;
		}

		const guidebookCustomDir = settings.guidebookCustomDir;
		if (!guidebookCustomDir) {
			return;
		}

		const guidebookRoot = this.novelLibraryService.normalizeVaultPath(guidebookCustomDir);
		if (!guidebookRoot) {
			return;
		}
		if (this.novelLibraryService.isSameOrChildPath(normalizedPath, guidebookRoot)) {
			target.add(guidebookRoot);
		}
	}

	private invalidateByLibraryRoot(
		settings: Pick<SettingDatas, "guidebookCustomDir">,
		libraryRoot: string,
	): void {
		const key = this.createCacheKey(settings, libraryRoot);
		this.snapshots.delete(key);
		this.pendingSnapshots.delete(key);
	}

	private createCacheKey(
		settings: Pick<SettingDatas, "guidebookCustomDir">,
		normalizedLibraryPath: string,
	): string {
		return normalizedLibraryPath;
	}

	private compareByQuery(left: GuidebookQuickInsertCandidate, right: GuidebookQuickInsertCandidate, query: string): number {
		const leftIndex = left.keywordLower.indexOf(query);
		const rightIndex = right.keywordLower.indexOf(query);
		if (leftIndex !== rightIndex) {
			return leftIndex - rightIndex;
		}
		if (left.keyword.length !== right.keyword.length) {
			return left.keyword.length - right.keyword.length;
		}
		return left.keyword.localeCompare(right.keyword);
	}
}
