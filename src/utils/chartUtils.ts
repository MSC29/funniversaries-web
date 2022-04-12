import { AxisOptions, Options, PointOptionsObject } from 'highcharts';
import { Anniversary } from '../entities/anniversary';

export class ChartUtils {
	static readonly NUMBER_OF_YEAR: number = 50;

	static buildAnniversariesOptions(options: Highcharts.Options, anniversaries: Anniversary[]): Options {
		const points: PointOptionsObject[] = [];
		const yearlyDistribution: Map<number, number> = new Map();

		const anniversariesScale: number[] = ChartUtils.buildAnniversariesPadding();
		anniversariesScale.forEach((y: number) => yearlyDistribution.set(y, 0));

		anniversaries.forEach((anniversary: Anniversary) => {
			const year: number = anniversary.date.getFullYear();
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

	static buildAnniversariesPadding(): number[] {
		const list: number[] = [];

		const init: number = new Date().getFullYear();
		for (let i: number = 0; i < ChartUtils.NUMBER_OF_YEAR; i++) {
			list.push(init + i);
		}

		return list;
	}

	static buildOptionsTimeSeries(): Highcharts.Options {
		return {
			chart: {
				zoomType: 'x',
				backgroundColor: '#151719',
				style: {
					color: '#9CA9B3'
				},
				height: 200,
				spacingBottom: 50
			},

			title: {},

			tooltip: {
				formatter() {
					return `${this.y} anniversaries in ${this.x}`;
				}
			},

			yAxis: {
				title: {
					text: undefined
				},
				gridLineColor: '#151719',
				labels: {
					enabled: false
				}
			},

			xAxis: {
				title: {
					text: undefined
				},
				labels: {
					align: 'right',
					x: 10,
					y: 15
				}
			},

			legend: {
				enabled: false
			},

			plotOptions: {
				column: {
					borderRadius: 2
				},
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
