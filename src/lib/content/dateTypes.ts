import { m } from '#lib/paraglide/messages.js';

// src/lib/content/dateTypes.ts
export interface DateTypeCalculator {
	slug: string | undefined;
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
	},
	{
		slug: 'moving-in',
		title: m.datatype_moving_in_title(),
		h1: m.datatype_moving_in_h1(),
		subtitle: m.datatype_moving_in_subtitle(),
		label: m.datatype_moving_in_label(),
		description: m.datatype_moving_in_description(),
		defaultLabel: m.datatype_moving_in_defaultLabel()
	},
	{
		slug: 'new-parent',
		title: m.datatype_new_parent_title(),
		h1: m.datatype_new_parent_h1(),
		subtitle: m.datatype_new_parent_subtitle(),
		label: m.datatype_new_parent_label(),
		description: m.datatype_new_parent_description(),
		defaultLabel: m.datatype_new_parent_defaultLabel()
	},
	{
		slug: 'business-launch',
		title: m.datatype_business_launch_title(),
		h1: m.datatype_business_launch_h1(),
		subtitle: m.datatype_business_launch_subtitle(),
		label: m.datatype_business_launch_label(),
		description: m.datatype_business_launch_description(),
		defaultLabel: m.datatype_business_launch_defaultLabel()
	},
	{
		slug: 'achievement',
		title: m.datatype_achievement_title(),
		h1: m.datatype_achievement_h1(),
		subtitle: m.datatype_achievement_subtitle(),
		label: m.datatype_achievement_label(),
		description: m.datatype_achievement_description(),
		defaultLabel: m.datatype_achievement_defaultLabel()
	},
	{
		slug: 'reunion',
		title: m.datatype_reunion_title(),
		h1: m.datatype_reunion_h1(),
		subtitle: m.datatype_reunion_subtitle(),
		label: m.datatype_reunion_label(),
		description: m.datatype_reunion_description(),
		defaultLabel: m.datatype_reunion_defaultLabel()
	}
];
