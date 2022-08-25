import React, { useCallback, useEffect, useState } from 'react';
import Snake from './Snake';
import FlappyBird from './Flappybird';
import Saper from './Saper';
interface AppData {
	appId: string;
}

function Loading(props: AppData) {
	const [gameInfo, updateGameInfo] = useState(<div></div>);
	const determineGame = useCallback(() => {
		switch (props.appId) {
			case 'snake':
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
				break;
			case 'flappybird':
				setTimeout(() => {
					updateGameInfo(<FlappyBird />);
				}, 2000);
				updateGameInfo(
					<div className='loading'>
						<div className='lds-dual-ring'></div>
						<h3>Loading</h3>
						<div className='gameInfo'>
							<div className='pc'>PC: LMB to jump</div>
							<div className='mobile'>MOBILE: TAP to jump</div>
						</div>
					</div>
				);
				break;
			case 'saper':
				setTimeout(() => {
					updateGameInfo(<Saper />);
				}, 2000);
				updateGameInfo(
					<div className='loading'>
						<div className='lds-dual-ring'></div>
						<h3>Loading</h3>
						<div className='gameInfo'>
							<div className='pc'>PC: LMB to discover, RMB to place a flag</div>
							<div className='mobile'>
								MOBILE: Tap to discover, hold to place a flag
							</div>
						</div>
					</div>
				);
				break;
			default:
		}
	}, [props.appId]);

	useEffect(() => {
		determineGame();
	}, [determineGame]);

	return gameInfo;
}

export default Loading;
