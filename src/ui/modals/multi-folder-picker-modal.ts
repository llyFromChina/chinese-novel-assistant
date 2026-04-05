import {App, FuzzySuggestModal, TFolder} from "obsidian";

interface MultiFolderPickerModalOptions {
	app: App;
	title: string;
	selectedFolders: string[];
	onSubmit: (folders: string[]) => void;
	query?: string;
	supportMultiple?: boolean;
}

export class MultiFolderPickerModal extends FuzzySuggestModal<TFolder> {
	private readonly selectedFolders: Set<string>;
	private readonly onSubmitCallback: (folders: string[]) => void;
	private readonly initialQuery: string;
	private readonly supportMultiple: boolean;

	constructor(options: MultiFolderPickerModalOptions) {
		super(options.app);
		this.titleEl.setText(options.title);
		this.selectedFolders = new Set(options.selectedFolders);
		this.onSubmitCallback = options.onSubmit;
		this.initialQuery = options.query || "";
		this.supportMultiple = options.supportMultiple || false;

		this.setInstructions([
			{command: "点击", purpose: "选择/取消选择目录"},
			{command: "Enter", purpose: "确认选择"},
			{command: "Esc", purpose: "取消"}
		]);
	}

	onOpen() {
		super.onOpen();

		// 设置初始查询文本并触发搜索
		if (this.initialQuery) {
			this.inputEl.value = this.initialQuery;
			// 触发搜索
			this.inputEl.dispatchEvent(new Event('input'));
		}
	}

	getItems(): TFolder[] {
		return this.app.vault.getAllFolders();
	}

	getItemText(item: TFolder): string {
		return item.path;
	}

	// 重写 getSuggestions 方法，确保已选择的目录始终显示在前面
	getSuggestions(query: string) {
		// 获取所有已选择的目录（保持选择顺序）
		const selectedFolders = Array.from(this.selectedFolders);

		// 获取所有文件夹
		const allFolders = this.getItems();

		// 构建已选择的匹配项
		const selectedMatches: any[] = [];
		selectedFolders.forEach(folderPath => {
			const folder = allFolders.find(f => f.path === folderPath);
			if (folder) {
				// 创建一个模拟的 FuzzyMatch 对象
				selectedMatches.push({item: folder, match: null});
			}
		});

		// 对未选择的文件夹进行模糊匹配
		const fuzzyMatches = super.getSuggestions(query);
		const unselectedMatches = fuzzyMatches.filter(match => !this.selectedFolders.has(match.item.path));

		// 已选择的目录在前（按照选择顺序，最后选择的在最上面），未选择的目录在后
		return [...selectedMatches.reverse(), ...unselectedMatches];
	}

	renderSuggestion(item: any, el: HTMLElement) {
		// 从 FuzzyMatch 中获取实际的 TFolder 对象
		const folder = item.item;

		// 清空元素，重新构建
		el.empty();

		// 设置 flex 布局，让路径在左，对号在右
		el.style.display = "flex";
		el.style.alignItems = "center";
		el.style.justifyContent = "space-between";

		// 显示目录路径
		const pathEl = el.createDiv();
		pathEl.setText(folder.path);
		pathEl.style.flex = "1";

		// 检查当前目录是否已被选择
		if (this.selectedFolders.has(folder.path)) {
			el.addClass("cna-folder-picker-selected");
			const checkDiv = el.createDiv({cls: "cna-folder-picker-check"});
			checkDiv.setText("✓");
			checkDiv.style.marginLeft = "10px";
		}
	}

	onChooseItem(item: TFolder, _evt: MouseEvent | KeyboardEvent) {
		// 切换目录的选择状态
		if (this.selectedFolders.has(item.path)) {
			this.selectedFolders.delete(item.path);
		} else {
			if (!this.supportMultiple) {
				this.selectedFolders.clear();
			}
			this.selectedFolders.add(item.path);
		}

		// 保存当前的查询文本
		const currentQuery = this.inputEl.value;

		// 重新打开模态框以更新选择状态，保持查询文本
		this.close();
		openMultiFolderPicker(
			this.app,
			this.titleEl.textContent || "选择目录",
			Array.from(this.selectedFolders),
			this.onSubmitCallback,
			currentQuery,
			this.supportMultiple
		);
		this.onSubmitCallback(Array.from(this.selectedFolders));
	}
}

/**
 * 打开多选目录选择器
 * @param app Obsidian 应用实例
 * @param title 模态框标题
 * @param selectedFolders 当前已选择的目录
 * @param onSubmit 选择完成后的回调函数
 * @param query 初始查询文本
 * @param supportMultiple 是否支持多选
 */
export function openMultiFolderPicker(
	app: App,
	title: string,
	selectedFolders: string[],
	onSubmit: (folders: string[]) => void,
	query?: string,
	supportMultiple?: boolean
): void {
	new MultiFolderPickerModal({
		app,
		title,
		selectedFolders,
		onSubmit,
		query,
		supportMultiple: supportMultiple || false
	}).open();
}
