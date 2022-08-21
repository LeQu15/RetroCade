import React from 'react';
import Loading from './Loading';

interface AppData {
	appId: string;
	updateParentModule: any;
}

function App(props: AppData) {
	const playApp = () => {
		if (props.appId === 'snake') {
			return (
				<div className='gameBackground'>
					<div className='game'>
						<button id='closeGame' onClick={props.updateParentModule}>
							X
						</button>
						<Loading appId={props.appId} />
					</div>
				</div>
			);
		} else {
			return null;
		}
	};

	return <>{playApp()}</>;
}

export default App;
