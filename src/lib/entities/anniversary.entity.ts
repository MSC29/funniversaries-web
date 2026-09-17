export interface FunNumberDef {
	// human readable anniversary "123321", "π"
	title: string;
	// number associated with anniversary 123321, 3.14...
	count: number;
	// description & details
	description: string;
	// a label to identify the event
	label: string;
	// type of Fun Anniversary (palindrome, repeated digit, round number, geek code, meme number)
	type: string;
	// time to anniversary
	distance: string;
	// bucket grouped by date
	bucket: string;
}

export interface Anniversary {
	// unit associated with anniversary
	unit: string;
	// anniversary date
	date: Date | undefined;

	// FunNumberDef
	funNumber: FunNumberDef;
}

export interface AnniversaryPayload {
	// unit associated with anniversary
	unit: string;
	// anniversary date
	date: Date | undefined;

	// FunNumberDef
	fun_number: FunNumberDef;
}
