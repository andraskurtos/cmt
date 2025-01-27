import { render } from 'preact';
import "./index.less";
import preactLogo from './assets/preact.svg';
import { Grid } from './grid';

export function App() {
	return (
		<div>
			<h1> CMT GAME</h1>
			<Grid/>
		</div>
	);
}



render(<App />, document.getElementById('app'));
