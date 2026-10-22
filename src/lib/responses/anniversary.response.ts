export interface FunNumberDefResponse {
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

export interface AnniversaryResponse {
	// unit associated with anniversary
	unit: string;
	// anniversary instant, ISO 8601 UTC string on the wire
	date: string;
	// FunNumberDef
	funNumber: FunNumberDefResponse;
}

export interface AnniversaryBucketResponse {
	//for svelte to deduplicate in list
	id: number;
	//anniversary
	anniversary: AnniversaryResponse;
}

export interface AnniversariesBucketResponse {
	// stable key for the time horizon, e.g. "thisWeek" (not a display string)
	horizon: string;
	// every anniversary in this horizon, shown or not
	total: number;
	// the ones returned: all of them when full, the best few when preview
	anniversaries: AnniversaryBucketResponse[];
}

export interface AnniversariesResponse {
	// chronological, empty horizons omitted
	buckets: AnniversariesBucketResponse[];
	// sum of every bucket's total: the "185"
	total: number;
}
