import React, { useEffect, useState } from 'react';
import Snake from './Snake';
interface AppData {
	appId: string;
}

function Loading(props: AppData) {
	const [gameInfo, updateGameInfo] = useState(<div></div>);
	const determineGame = () => {
		if (props.appId === 'snake') {
			setTimeout(() => {
				updateGameInfo(<Snake />);
			}, 2000);
			updateGameInfo(
				<div className='loading'>
					<div className='lds-dual-ring'></div>
					<h3>Loading</h3>
					<div className='gameInfo'>
						<div className='pc'>PC: WASD or ARROWS to move</div>
						<div className='mobile'>MOBILE: SWIPE to move</div>
					</div>
				</div>
			);
		}
	};

	useEffect(() => {
		determineGame();
	}, []);

	return gameInfo;
}

export default Loading;
