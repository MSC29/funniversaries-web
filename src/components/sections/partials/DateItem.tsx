import React from 'react';

import { Anniversary } from '../../../entities/anniversary';

import SecondImage from '../../../assets/images/feature-tile-icon-01.svg';
import DayImage from '../../../assets/images/feature-tile-icon-02.svg';
import WeekImage from '../../../assets/images/feature-tile-icon-03.svg';

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

interface Props extends InputProps {
	key: string;
	anniversary: Anniversary;
}

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

const DateItem = ({ key, anniversary }: Props): JSX.Element => {
	return (
		<>
			{
				<div className="tiles-item reveal-from-bottom" key={key}>
					<div className="tiles-item-inner">
						<div className="features-tiles-item-header">
							<div className="features-tiles-item-image mb-16">
								<img src={getImageForUnit(anniversary.unit)} alt="Features tile icon 01" width="64" height="64" />
							</div>
						</div>
						<div className="features-tiles-item-content">
							<h4 className="mt-0 mb-8">
								{anniversary.count} {anniversary.unit}
							</h4>
							<p className="m-0 text-sm">{new Date(anniversary.date).toLocaleDateString()}</p>
						</div>
					</div>
				</div>
			}
		</>
	);
};

export default DateItem;
