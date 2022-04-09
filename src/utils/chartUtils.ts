import { AxisOptions, Options, PointOptionsObject } from 'highcharts';
import { Anniversary } from '../entities/anniversary';

export class ChartUtils {
	static buildAnniversariesOptions(options: Highcharts.Options, anniversaries: Anniversary[]): Options {
		const points: PointOptionsObject[] = [];
		const yearlyDistribution: Map<number, number> = new Map();
		anniversaries.forEach((r: Anniversary) => {
			const year: number = r.date.getFullYear();
			if (yearlyDistribution.has(year)) {
				const v: number = yearlyDistribution.get(year) || 1;
				yearlyDistribution.set(year, v + 1);
			} else {
				yearlyDistribution.set(year, 1);
			}
		});

		yearlyDistribution.forEach((value: number, key: number) => {
			const point: PointOptionsObject = {
				x: key,
				y: value
			};
			points.push(point);
		});

		const series: Highcharts.SeriesColumnOptions[] = [];
		series[0] = {
			name: 'distribution over time',
			type: 'column',
			data: points
		};

		options.series = series;
		(options.xAxis as AxisOptions).categories = Array.from(yearlyDistribution.keys()).map((year: number) => year.toString());
		options.title = {
			text: 'Anniversaries distribution per year'
		};

		return options;
	}

	static buildOptionsTimeSeries(): Highcharts.Options {
		return {
			chart: {
				zoomType: 'x'
			},

			title: {},

			yAxis: {
				title: {
					text: 'Number of anniversaries'
				}
			},

			xAxis: {
				title: {
					text: 'Years'
				}
			},

			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},

			plotOptions: {
				series: {
					label: {
						connectorAllowed: false
					}
				}
			},

			series: [],

			credits: {
				enabled: false
			}
		};
	}
}
