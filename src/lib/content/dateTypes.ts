// src/lib/content/dateTypes.ts
export interface DateTypeCalculator {
	slug: string;
	title: string; // <title> tag
	h1: string;
	subtitle: string;
	description: string; // meta description + intro copy
	defaultLabel: string; // e.g. "days together" — flavors the hero card
}

export const dateTypes: DateTypeCalculator[] = [
	{
		slug: 'default',
		title: 'Find Your Next Milestone',
		h1: 'Your next weird anniversary is closer than you think.',
		subtitle:
			"1000 days together. A billion seconds alive. 1,000 weeks at the same job. Pick a date and we'll find every number worth throwing a party for.",
		description:
			'Pick the date you started dating and find every round number, palindrome, and meme-worthy milestone still ahead — perfect for planning a surprise.',
		defaultLabel: 'engine'
	},

	{
		slug: 'relationship-anniversary-calculator',
		title: 'Relationship Anniversary Calculator — Find Your Next Milestone',
		h1: 'Your next relationship milestone is closer than you think',
		subtitle: 'in days, weeks, hours or seconds together',
		description:
			'Pick the date you started dating and find every round number, palindrome, and meme-worthy milestone still ahead — perfect for planning a surprise.',
		defaultLabel: 'days together'
	},
	{
		slug: 'baby-age-in-days',
		title: 'Baby Age in Days Calculator — Milestone Finder',
		h1: 'How many days old is your little one?',
		subtitle: 'track their age in days, weeks and hours',
		description:
			"New parents track days, not just months. Enter your baby's birth date and find the next milestone worth a photo — 100 days, 777 days, 1,000 days.",
		defaultLabel: 'days old'
	},
	{
		slug: 'work-anniversary-calculator',
		title: 'Work Anniversary Calculator — Job Milestone Finder',
		h1: 'How long have you really been at this job?',
		subtitle: 'in days, months and years',
		description:
			'Enter your start date and find upcoming milestones worth marking — or at least noting.',
		defaultLabel: 'days on the job'
	}
];
