import React, { useState } from 'react';
import * as funniversaries from 'funniversaries';
import DatePicker from 'react-date-picker';

import SecondImage from '../assets/images/feature-tile-icon-01.svg';
import DayImage from '../assets/images/feature-tile-icon-02.svg';
import WeekImage from '../assets/images/feature-tile-icon-03.svg';

// import SectionHeader from '../components/sections/partials/SectionHeader';

import { Anniversary } from '../entities/anniversary';

const Home = () => {
	const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
	const [inputDateTime, onChange] = useState<Date>(new Date());

	React.useEffect(() => {
		async function execute() {
			console.log(inputDateTime);
			const anniversaries: Anniversary[] = await funniversaries.generate_anniversaries(inputDateTime.toISOString());

			//filtering out invalid JS dates
			const validAnniversaries: Anniversary[] = anniversaries
				.map((a: Anniversary) => {
					const dateObj = new Date(a.date);
					if (dateObj instanceof Date && !isNaN(dateObj.valueOf())) {
						a.date = dateObj;
						return a;
					}
					return undefined;
				})
				.filter((item: Anniversary | undefined): item is Anniversary => item !== undefined);

			//anniversaries are coming back sorted, but we're changing the sort order here
			const anniversariesSorted = validAnniversaries.sort((a: Anniversary, b: Anniversary) => a.date.getTime() - b.date.getTime());

			setAnniversaries(anniversariesSorted);
			console.log(anniversaries);
		}

		void execute();
	}, [inputDateTime]);

	const sectionHeader = {
		title: 'Results',
		paragraph: 'These are the anniversaries'
	};

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

			<section className="features-tiles section">
				<div className="container">
					<div className="features-tiles-inner section-inner pt-0">
						{/* <SectionHeader data={sectionHeader} className="center-content" /> */}
						<div className="tiles-wrap center-content">
							{anniversaries.map(a => (
								<div className="tiles-item reveal-from-bottom" key={`${a.date}${a.name}${a.count}${a.unit}`}>
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
		</>
	);
};

export default Home;
