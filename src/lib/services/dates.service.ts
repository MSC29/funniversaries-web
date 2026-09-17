import type { Anniversary } from '../entities/anniversary.entity';
import type { TimeEntity } from '../entities/time.entity';

export class DatesService {
	async generateFutureAnniversaries(date: Date): Promise<Anniversary[]> {
		const anniversariesList: Anniversary[] = [];

		const anniversary1: Anniversary = {
			unit: 'months',
			date: date,
			title: 'π',
			count: 3.141592653589793,
			description: "Ratio of a circle's circumference to its diameter",
			label: 'time together',
			type: 'RepDigit',
			distance: 'in 2 weeks',
			bucket: 'This month'
		};
		const anniversary2: Anniversary = {
			unit: 'months',
			date: date,
			title: 'τ',
			count: 6.283185307179586,
			description: "Ratio of a circle's circumference to its radius. Equivalent to 2 π",
			label: 'time together',
			type: 'RepDigit',
			distance: 'in 5 weeks',
			bucket: 'Next month'
		};
		const anniversary3: Anniversary = {
			unit: 'months',
			date: date,
			title: 'φ',
			count: 1.618033988749894,
			description: 'Golden ratio',
			label: 'time together',
			type: 'RepDigit',
			distance: 'in 7 weeks',
			bucket: 'Next month'
		};
		const anniversary4: Anniversary = {
			unit: 'months',
			date: date,
			title: 'e',
			count: 2.718281828459045,
			description: "Euler's number ",
			label: 'time together',
			type: 'RepDigit',
			distance: 'in 6 month',
			bucket: 'This year'
		};

		anniversariesList.push(anniversary1);
		anniversariesList.push(anniversary2);
		anniversariesList.push(anniversary3);
		anniversariesList.push(anniversary4);

		return await Promise.all(anniversariesList);
	}

	init_time = (): TimeEntity => {
		const now = new Date();
		this.applyLocale(now);

		const now_date = this.getDateString(now);
		const now_time = this.getTimeString(now);

		const time: TimeEntity = {
			now,
			dateNow: now_date,
			timeNow: now_time
		};

		return time;
	};

	getDateString = (now: Date): string => {
		this.applyLocale(now);

		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');

		return [year, month, day].join('-');
	};

	getTimeString = (now: Date): string => {
		this.applyLocale(now);

		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');

		return [hours, minutes].join(':');
	};

	applyLocale = (now: Date): void => {
		now.toLocaleString('fr-FR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	};
}
