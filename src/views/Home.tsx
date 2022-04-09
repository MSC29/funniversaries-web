import React, { useState } from 'react';
import * as funniversaries from 'funniversaries';
import DatePicker from 'react-date-picker';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Title } from '../components/Title';

import SecondImage from '../assets/images/feature-tile-icon-01.svg';
import DayImage from '../assets/images/feature-tile-icon-02.svg';
import WeekImage from '../assets/images/feature-tile-icon-03.svg';

// import SectionHeader from '../components/sections/partials/SectionHeader';

import { Anniversary } from '../entities/anniversary';
import { ChartUtils } from '../utils/chartUtils';

const Home = (): JSX.Element => {
	const [anniversaries, setAnniversaries]: [Anniversary[], React.Dispatch<React.SetStateAction<Anniversary[]>>] = useState<Anniversary[]>([]);
	const [inputDateTime, onChange]: [Date, React.Dispatch<React.SetStateAction<Date>>] = useState<Date>(new Date());

	const [rawVotesOptions, setRawVotesOptions]: [unknown, React.Dispatch<React.SetStateAction<unknown>>] = useState<unknown>({});

	React.useEffect(() => {
		const execute: () => Promise<void> = async () => {
			const generatedAnniversaries: Anniversary[] = await funniversaries.generate_future_anniversaries(inputDateTime.toISOString());

			//filtering out invalid/useless JS dates
			const now: Date = new Date();
			const lifetime: number = now.getFullYear() + 50;
			const validAnniversaries: Anniversary[] = generatedAnniversaries
				.map((a: Anniversary) => {
					const dateObj: Date = new Date(a.date);
					if (dateObj instanceof Date && !isNaN(dateObj.valueOf()) && dateObj.getFullYear() < lifetime) {
						a.date = dateObj;
						return a;
					}
					return undefined;
				})
				.filter((item: Anniversary | undefined): item is Anniversary => item !== undefined);

			//anniversaries are coming back sorted, but we're changing the sort order here
			const anniversariesSorted: Anniversary[] = validAnniversaries.sort((a: Anniversary, b: Anniversary) => a.date.getTime() - b.date.getTime());

			setAnniversaries(anniversariesSorted);

			const rawVotesOptionsLocal: Highcharts.Options = ChartUtils.buildAnniversariesOptions(ChartUtils.buildOptionsTimeSeries(), anniversariesSorted);
			setRawVotesOptions(rawVotesOptionsLocal);
		};

		void execute();
	}, [inputDateTime]);

	// const sectionHeader: unknown = {
	// 	title: 'Results',
	// 	paragraph: 'These are the anniversaries'
	// };

	const getImageForUnit = (unit: string) => {
		if (unit === 'seconds') {
			return SecondImage;
		} else if (unit === 'days') {
			return DayImage;
		} else if (unit === 'weeks') {
			return WeekImage;
		} else {
			return SecondImage;
		}
	};

	return (
		<>
			<section className="hero section center-content">
				<div className="container-sm">
					<div className="hero-inner section-inner">
						<div>
							<div className="hero-content">
								<h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
									Fun Anniversaries
								</h1>
								<div className="container-xs">
									<p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
										Pick a date and discover its anniversaries worthy of celebrating!
									</p>
									<div className="reveal-from-bottom" data-reveal-delay="600">
										<DatePicker onChange={onChange} value={inputDateTime} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<Tabs>
				<TabList>
					<Tab>résultats</Tab>
					<Tab>visualisation temps réel</Tab>
				</TabList>

				<TabPanel>
					<Title>resultats</Title>

					<section className="features-tiles section">
						<div className="container">
							<div className="features-tiles-inner section-inner pt-0">
								{/* <SectionHeader data={sectionHeader} className="center-content" /> */}
								<div className="tiles-wrap center-content">
									{anniversaries.map((a: Anniversary) => (
										<div className="tiles-item reveal-from-bottom" key={`${a.date.toISOString()}${a.name}${a.count}${a.unit}`}>
											<div className="tiles-item-inner">
												<div className="features-tiles-item-header">
													<div className="features-tiles-item-image mb-16">
														<img src={getImageForUnit(a.unit)} alt="Features tile icon 01" width="64" height="64" />
													</div>
												</div>
												<div className="features-tiles-item-content">
													<h4 className="mt-0 mb-8">
														{a.count} {a.unit}
													</h4>
													<p className="m-0 text-sm">{new Date(a.date).toLocaleDateString()}</p>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</section>
				</TabPanel>
				<TabPanel>
					<h2>Distribution</h2>
					<HighchartsReact highcharts={Highcharts} options={rawVotesOptions} />
				</TabPanel>
			</Tabs>
		</>
	);
};

export default Home;
