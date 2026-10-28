import { m } from '$lib/paraglide/messages.js';

// src/lib/content/dateTypes.ts
export interface DateTypeCalculator {
	slug: string;
	title: string; // <title> tag
	h1: string;
	subtitle: string;
	label: string;
	description: string; // meta description + intro copy
	defaultLabel: string; // e.g. "days together" — flavors the hero card
}

export const dateTypes: DateTypeCalculator[] = [
	{
		slug: 'default',
		title: m.datatype_default_title(),
		h1: m.datatype_default_h1(),
		subtitle: m.datatype_default_subtitle(),
		label: m.datatype_default_label(),
		description: m.datatype_default_description(),
		defaultLabel: m.datatype_default_defaultLabel()
	},
	{
		slug: 'relationship-anniversary-calculator',
		title: m.datatype_relanniversary_title(),
		h1: m.datatype_relanniversary_h1(),
		subtitle: m.datatype_relanniversary_subtitle(),
		label: m.datatype_relanniversary_label(),
		description: m.datatype_relanniversary_description(),
		defaultLabel: m.datatype_relanniversary_defaultLabel()
	},
	{
		slug: 'baby-age-in-days',
		title: m.datatype_babyage_title(),
		h1: m.datatype_babyage_h1(),
		subtitle: m.datatype_babyage_subtitle(),
		label: m.datatype_babyage_label(),
		description: m.datatype_babyage_description(),
		defaultLabel: m.datatype_babyage_defaultLabel()
	},
	{
		slug: 'work-anniversary-calculator',
		title: m.datatype_workanniversary_title(),
		h1: m.datatype_workanniversary_h1(),
		subtitle: m.datatype_workanniversary_subtitle(),
		label: m.datatype_bworkanniversary_label(),
		description: m.datatype_workanniversary_description(),
		defaultLabel: m.datatype_workanniversary_defaultLabel()
	}
];
