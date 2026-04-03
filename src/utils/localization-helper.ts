import {LocalizationConstants} from "./localization-constants";

export function getLocalizedString(key: string): string {
	const keys = key.split(".");
	let result: any = LocalizationConstants;

	for (const k of keys) {
		if (result[k] === undefined) {
			return key;
		}
		result = result[k];
	}

	return typeof result === "string" ? result : key;
}
