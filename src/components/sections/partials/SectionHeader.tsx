/* eslint-disable @typescript-eslint/typedef */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
	data: PropTypes.shape({
		title: PropTypes.string,
		paragraph: PropTypes.string
	}).isRequired,
	children: PropTypes.node,
	tag: PropTypes.oneOf(['h1', 'h2', 'h3'])
};

const defaultProps = {
	children: null,
	tag: 'h2'
};

interface Data {
	title: string;
	paragraph: string;
}

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

interface Props extends InputProps {
	className: string;
	data: Data;
	children: string;
	tag: string;
}

const SectionHeader = ({ className, data, children, ...props }: Props) => {
	const classes = classNames('section-header', className);

	return (
		<>
			{(data.title || data.paragraph) && (
				<div {...props} className={classes}>
					<div className="container-xs">
						{children}
						{data.title}
						{data.paragraph && <p className="m-0">{data.paragraph}</p>}
					</div>
				</div>
			)}
		</>
	);
};

SectionHeader.propTypes = propTypes;
SectionHeader.defaultProps = defaultProps;

export default SectionHeader;
