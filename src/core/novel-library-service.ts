import {App, TFolder} from "obsidian";
import type {SettingDatas} from "./setting-datas";

export function normalizeVaultPath(value: string): string {
	return value
		.trim()
		.replace(/\\/g, "/")
		.replace(/^\/+/, "")
		.replace(/\/+$/, "");
}

export class NovelLibraryService {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	normalizeVaultPath(value: string): string {
		return normalizeVaultPath(value);
	}

	async ensureFolderPath(path: string): Promise<void> {
		const normalizedPath = this.normalizeVaultPath(path);
		if (!normalizedPath) {
			return;
		}

		const segments = normalizedPath.split("/").filter((segment) => segment.length > 0);
		let currentPath = "";
		for (const segment of segments) {
			currentPath = currentPath ? `${currentPath}/${segment}` : segment;
			const existing = this.app.vault.getAbstractFileByPath(currentPath);
			if (!existing) {
				await this.app.vault.createFolder(currentPath);
				continue;
			}

			if (!(existing instanceof TFolder)) {
				throw new Error(`Path already exists as file: ${currentPath}`);
			}
		}
	}

	// 获取自定义目录路径
	getCustomDirPath(customDir: string): string {
		return this.normalizeVaultPath(customDir);
	}

	// 检查自定义目录是否存在，如果不存在则创建
	async ensureCustomDir(customDir: string): Promise<string> {
		const normalizedPath = this.getCustomDirPath(customDir);
		if (!normalizedPath) {
			return "";
		}

		await this.ensureFolderPath(normalizedPath);
		return normalizedPath;
	}

	// 检查路径是否在自定义目录中
	isPathInCustomDir(path: string, customDir: string): boolean {
		// 处理多个目录的情况，使用逗号分隔
		if (customDir && customDir.includes(",")) {
			const dirPathArr = customDir.split(",").map(it => it.trim()).filter(Boolean);
			return dirPathArr.some(dir => this.isPathInCustomDir(path, dir));
		}

		// 规范化路径
		const normalizedPath = this.normalizeVaultPath(path);
		const normalizedCustomDir = this.getCustomDirPath(customDir);

		// 验证路径有效性
		if (!normalizedPath || !normalizedCustomDir) {
			return false;
		}

		// 检查路径是否匹配
		return normalizedPath === normalizedCustomDir || normalizedPath.startsWith(`${normalizedCustomDir}/`);
	}

	// 获取功能的自定义目录路径
	getFeatureCustomDir(settings: SettingDatas, feature: keyof Pick<SettingDatas, "guidebookCustomDir" | "stickyNoteCustomDir" | "annotationCustomDir" | "timelineCustomDir" | "snippetCustomDir" | "proofreadDictionaryCustomDir">): string {
		return this.getCustomDirPath(settings[feature]);
	}

	// 确保功能的自定义目录存在
	async ensureFeatureCustomDir(settings: SettingDatas, feature: keyof Pick<SettingDatas, "guidebookCustomDir" | "stickyNoteCustomDir" | "annotationCustomDir" | "timelineCustomDir" | "snippetCustomDir" | "proofreadDictionaryCustomDir">): Promise<string> {
		const customDir = settings[feature];
		return this.ensureCustomDir(customDir);
	}

	// 检查路径是否相同或为子路径
	isSameOrChildPath(path: string, rootPath: string): boolean {
		const normalizedPath = this.normalizeVaultPath(path);
		const normalizedRootPath = this.normalizeVaultPath(rootPath);

		if (!normalizedPath || !normalizedRootPath) {
			return false;
		}

		return normalizedPath === normalizedRootPath || normalizedPath.startsWith(`${normalizedRootPath}/`);
	}

	// 规范化库根路径（保持向后兼容）
	normalizeLibraryRoots(libraryRoots: string[]): string[] {
		return libraryRoots.map((root) => this.normalizeVaultPath(root)).filter((root) => root.length > 0);
	}

	// 解析包含的库根路径（保持向后兼容）
	resolveContainingLibraryRoot(filePath: string, libraryRoots: string[]): string | null {
		const normalizedFilePath = this.normalizeVaultPath(filePath);
		if (!normalizedFilePath) {
			return null;
		}

		for (const libraryRoot of libraryRoots) {
			const normalizedLibraryRoot = this.normalizeVaultPath(libraryRoot);
			if (this.isSameOrChildPath(normalizedFilePath, normalizedLibraryRoot)) {
				return normalizedLibraryRoot;
			}
		}

		return null;
	}

	// 检查路径是否在功能根目录中（保持向后兼容）
	isInFeatureRoot(filePath: string, settings: SettingDatas): boolean {
		const customDirs = [
			settings.guidebookCustomDir,
			settings.stickyNoteCustomDir,
			settings.annotationCustomDir,
			settings.timelineCustomDir,
			settings.snippetCustomDir,
			settings.proofreadDictionaryCustomDir
		];

		return customDirs.some((dir) => dir && this.isPathInCustomDir(filePath, dir));
	}
}
