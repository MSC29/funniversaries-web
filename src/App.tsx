import React, { ReactElement } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Views
import Home from './views/Home';

const App = (): ReactElement => {
	return (
		<BrowserRouter>
			<Helmet titleTemplate="%s" defaultTitle="Funniversaries">
				{/* htmlAttributes={{ lang: i18n.language }} */}
				<meta name="description" content="Funniversaries web app" />
			</Helmet>

			<Switch>
				<Route exact path="/" component={Home} />
			</Switch>
		</BrowserRouter>
	);
};

export default App;
