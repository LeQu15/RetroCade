import React, { useState } from 'react';
import App from './App';
import games from './games';

function Main() {
	const [activeModule, changeActiveModule] = useState('');
	const records = [
		JSON.parse(localStorage.getItem('saperrecord') || '0'),
		JSON.parse(localStorage.getItem('timberrecord') || '0'),
		JSON.parse(localStorage.getItem('flappyrecord') || '0'),
		JSON.parse(localStorage.getItem('snakerecord') || '0') + 's',
		JSON.parse(localStorage.getItem('saperrecord') || '0'),
	];

	const openModule = (e: React.MouseEvent) => {
		changeActiveModule(e.currentTarget.id);
	};

	const closeModule = () => {
		changeActiveModule('');
	};

	const getAllGames = () => {
		const array = games.map((item, index) => {
			return (
				<div key={index}>
					<div className='app' id={item.gameId} onClick={openModule}>
						<img src={item.icon} alt={item.gameName} />
						{item.gameName}
					</div>
					<h3>
						HS:
						{records[index]}
					</h3>
				</div>
			);
		});
		return array;
	};

	return (
		<main>
			<App appId={activeModule} updateParentModule={closeModule} />
			<div className='apps'>{getAllGames()}</div>
		</main>
	);
}

export default Main;
