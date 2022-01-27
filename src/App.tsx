import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Anniversary } from './entities/anniversary';
import * as funniversaries from 'funniversaries';
import DatePicker from 'react-date-picker';

function App() {
	const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
	const [inputDateTime, onChange] = useState<Date>(new Date());

	React.useEffect(() => {
		async function execute() {
			console.log(inputDateTime);
			const anniversaries: Anniversary[] = await funniversaries.generate_anniversaries(inputDateTime.toISOString()); //'1987-09-21T00:00:00.000Z');

			//anniversaries are coming back sorted, but we're changing the sort order here
			const anniversariesSorted = anniversaries.sort((a: Anniversary, b: Anniversary) => new Date(a.date).getTime() - new Date(b.date).getTime());

			setAnniversaries(anniversariesSorted);
			console.log(anniversaries);
		}

		void execute();
	}, [inputDateTime]);

	return (
		<div className="App">
			<p>Funniversaries</p>
			<p>
				<DatePicker onChange={onChange} value={inputDateTime} />
			</p>
			<p>
				{anniversaries.map(a => (
					<li key={`${a.date}${a.name}${a.count}${a.unit}`}>
						{a.date}: {a.name} {a.count} {a.unit}
					</li>
				))}
			</p>
		</div>
	);
}

export default App;
