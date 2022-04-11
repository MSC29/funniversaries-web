import React, { useState } from 'react';
import * as funniversaries from 'funniversaries';
import DatePicker from 'react-date-picker';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
// import { Title } from '../components/Title';

import SectionHeader from '../components/sections/partials/SectionHeader';

import { Anniversary } from '../entities/anniversary';
import { ChartUtils } from '../utils/chartUtils';
import DateItem from '../components/sections/partials/DateItem';

interface Data {
	title: string;
	paragraph: string;
}

const Home = (): JSX.Element => {
	const [anniversaries, setAnniversaries]: [Anniversary[], React.Dispatch<React.SetStateAction<Anniversary[]>>] = useState<Anniversary[]>([]);
	const [inputDateTime, onChange]: [Date, React.Dispatch<React.SetStateAction<Date>>] = useState<Date>(new Date());

	const [rawVotesOptions, setRawVotesOptions]: [unknown, React.Dispatch<React.SetStateAction<unknown>>] = useState<unknown>({});

	React.useEffect(() => {
		const execute: () => Promise<void> = async () => {
			const generatedAnniversaries: Anniversary[] = await funniversaries.generate_future_anniversaries(inputDateTime.toISOString());

			//filtering out invalid/useless JS dates
			const lifetime: number = new Date().getFullYear() + 50;
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

	const sectionHeaderCurrentYear: Data = {
		title: 'This year',
		paragraph: 'These are the anniversaries that happen this year'
	};

	const sectionHeaderNextYear: Data = {
		title: 'Next year',
		paragraph: 'These are the anniversaries that happen next year'
	};

	const sectionHeaderLater: Data = {
		title: 'Later on',
		paragraph: 'These are the anniversaries that will happen later on'
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

			<section className="features-tiles section">
				<div className="container">
					<HighchartsReact highcharts={Highcharts} options={rawVotesOptions} />
				</div>
				<div className="container">
					<div className="features-tiles-inner section-inner pt-0">
						<SectionHeader data={sectionHeaderCurrentYear} className="center-content" />
						<div className="tiles-wrap center-content">
							{anniversaries
								.filter((a: Anniversary) => a.date.getFullYear() <= new Date().getFullYear())
								.map((a: Anniversary) => (
									<DateItem key={`${a.date.toISOString()}${a.name}${a.count}${a.unit}`} anniversary={a}></DateItem>
								))}
						</div>
						<SectionHeader data={sectionHeaderNextYear} className="center-content" />
						<div className="tiles-wrap center-content">
							{anniversaries
								.filter((a: Anniversary) => a.date.getFullYear() > new Date().getFullYear() && a.date.getFullYear() <= new Date().getFullYear() + 1)
								.map((a: Anniversary) => (
									<DateItem key={`${a.date.toISOString()}${a.name}${a.count}${a.unit}`} anniversary={a}></DateItem>
								))}
						</div>
						<SectionHeader data={sectionHeaderLater} className="center-content" />
						<div className="tiles-wrap center-content">
							{anniversaries
								.filter((a: Anniversary) => a.date.getFullYear() > new Date().getFullYear() + 1)
								.map((a: Anniversary) => (
									<DateItem key={`${a.date.toISOString()}${a.name}${a.count}${a.unit}`} anniversary={a}></DateItem>
								))}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Home;
