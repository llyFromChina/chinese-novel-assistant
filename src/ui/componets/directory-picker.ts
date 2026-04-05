import {App, Setting} from "obsidian";
import {openMultiFolderPicker} from "../modals/multi-folder-picker-modal";

interface DirectoryPickerOptions {
	app: App;
	containerEl: HTMLElement;
	value: string;
	onChange: (value: string) => void;
	supportMultiple?: boolean;
	selectedContainerEl?: HTMLElement;
	getValue?: () => string;
}

export class DirectoryPicker {
	private readonly app: App;
	private containerEl: HTMLElement;
	private selectedContainerEl: HTMLElement;
	private value: string;
	private readonly onChange: (value: string) => void;
	private readonly supportMultiple: boolean;
	private readonly getValue?: () => string;

	constructor(options: DirectoryPickerOptions) {
		this.app = options.app;
		this.containerEl = options.containerEl;
		this.selectedContainerEl = options.selectedContainerEl || options.containerEl;
		this.value = options.value;
		this.onChange = options.onChange;
		this.supportMultiple = options.supportMultiple || false;
		this.getValue = options.getValue;

		this.render();
	}

	private render(): void {
		this.containerEl.empty();

		// 创建选择按钮
		const button = this.containerEl.createEl("button", {
			text: "选择目录",
			cls: "cna-directory-picker-button"
		});

		button.addEventListener("click", () => {
			this.openFolderPicker();
		});

		// 显示已选目录
		if (this.value) {
			this.renderSelectedDirectories();
		}
	}

	private renderSelectedDirectories(): void {
		// 清除现有的已选目录
		const existingList = this.selectedContainerEl.querySelector(".cna-directory-picker-selected");
		if (existingList) {
			existingList.remove();
		}

		if (!this.value) {
			return;
		}

		// 创建已选目录列表
		const selectedList = this.selectedContainerEl.createDiv({cls: "cna-directory-picker-selected"});
		const directories = this.value.split(",").map(dir => dir.trim()).filter(dir => dir);

		directories.forEach(dir => {
			const item = selectedList.createDiv({cls: "cna-directory-picker-selected-item"});
			item.setText(dir);

			const removeButton = item.createEl("button", {
				text: "×",
				cls: "cna-directory-picker-remove"
			});

			removeButton.addEventListener("click", () => {
				const newDirectories = directories.filter(d => d !== dir);
				const newValue = newDirectories.join(",");
				this.value = newValue;
				this.onChange(newValue);
				this.renderSelectedDirectories();
			});
		});
	}

	private openFolderPicker(): void {
		// 使用 getValue 方法获取最新的配置值，如果没有则使用内部 value
		const currentValue = this.getValue ? this.getValue() : this.value;
		const currentFolders = Array.from(new Set(currentValue.split(",").map(dir => dir.trim()).filter(dir => dir)));

		openMultiFolderPicker(
			this.app,
			"选择目录",
			currentFolders,
			(selectedFolders) => {
				const newValue = selectedFolders.join(",");
				this.value = newValue;
				this.onChange(newValue);
				this.renderSelectedDirectories();
			},
			undefined,
			this.supportMultiple
		);
	}
}

// 绑定目录选择器到设置项
export function attachDirectoryPicker(
	app: App,
	setting: Setting,
	options: {
		value: string;
		onChange: (value: string) => Promise<void>;
		getValue: () => string;
		supportMultiple: boolean
	}
): DirectoryPicker {
	// 创建控制元素容器，放在 controlEl 中
	const controlContainer = setting.controlEl.createDiv({cls: "cna-directory-picker-control"});

	// 创建已选目录容器，放在 settingEl 中，控制元素的下方
	const selectedContainer = setting.settingEl.createDiv({cls: "cna-directory-picker-selected-container"});

	return new DirectoryPicker({
		app,
		containerEl: controlContainer,
		selectedContainerEl: selectedContainer,
		...options
	});
}
