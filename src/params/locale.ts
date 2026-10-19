export function match(value: string) {
	try {
		console.log(`canonical ${value}`);
		const [canonical] = Intl.getCanonicalLocales(value);
		console.log(Intl.DateTimeFormat.supportedLocalesOf([canonical]).length);
		return !!canonical && Intl.DateTimeFormat.supportedLocalesOf([canonical]).length > 0;
	} catch {
		console.log(`unknown locale ${value}`);
		return false;
	}
}
