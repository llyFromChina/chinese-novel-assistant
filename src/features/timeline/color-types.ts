

export interface TimelineColorType {
	colorHex: string;
	labelKey: string;
	tagName: string;
}

export const TIMELINE_COLOR_TYPES: readonly TimelineColorType[] = [
	{ colorHex: "#4A86E9", labelKey: "feature.timeline.type.summary", tagName: "summary" },
	{ colorHex: "#7B61FF", labelKey: "feature.timeline.type.foreshadow", tagName: "foreshadow" },
	{ colorHex: "#47B881", labelKey: "feature.timeline.type.memo", tagName: "memo" },
	{ colorHex: "#F6C445", labelKey: "feature.timeline.type.side_story", tagName: "side_story" },
	{ colorHex: "#F59E0B", labelKey: "feature.timeline.type.bookmark", tagName: "bookmark" },
	{ colorHex: "#F05D6C", labelKey: "feature.timeline.type.comment", tagName: "comment" },
	{ colorHex: "#9CA3AF", labelKey: "feature.timeline.type.pending", tagName: "pending" },
];

export const TIMELINE_DEFAULT_COLOR = TIMELINE_COLOR_TYPES[TIMELINE_COLOR_TYPES.length - 1]?.colorHex ?? "#9CA3AF";
