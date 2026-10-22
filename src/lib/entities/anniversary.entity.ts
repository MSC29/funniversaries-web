export interface FunNumberDefEntity {
	// human readable anniversary "123321", "π"
	title: string;
	// number associated with anniversary 123321, 3.14...
	count: number;
	// description & details
	description: string;
	// a label to identify the event
	label: string;
	// type of fun anniversary (palindrome, repeated digit, round number, geek code, meme number)
	type: string;
}

export interface AnniversaryEntity {
	//for svelte to deduplicate in list
	id: number;
	// unit associated with anniversary
	unit: string;
	// anniversary instant, ISO 8601 UTC string on the wire
	date: Date;
	// FunNumberDef
	funNumber: FunNumberDefEntity;
}

export interface AnniversariesBucketEntity {
	// stable key for the time horizon, e.g. "thisWeek" (not a display string)
	horizon: string;
	// every anniversary in this horizon, shown or not
	total: number;
	// the ones returned: all of them when full, the best few when preview
	anniversaries: AnniversaryEntity[];
}

export interface AnniversariesEntity {
	// chronological, empty horizons omitted
	buckets: AnniversariesBucketEntity[];
	// sum of every bucket's total: the "185"
	total: number;
}

export interface AnniversaryExample {
	id: number;
	date: Date;
	title: string;
}
