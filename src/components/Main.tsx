import React, { useState } from 'react';
import ghost from '../img/ghost.png';
import flappy from '../img/flappy.png';
import apple from '../img/apple.png';
import timberman from '../img/timberman.png';
import App from './App';

function Main() {
	const snakerecord = JSON.parse(localStorage.getItem('snakerecord') || '0');
	const flappybirdrecord = JSON.parse(
		localStorage.getItem('flappyrecord') || '0'
	);
	const [activeModule, changeActiveModule] = useState('');

	const openModule = (e: React.MouseEvent) => {
		changeActiveModule(e.currentTarget.id);
	};

	const closeModule = () => {
		changeActiveModule('');
	};

	return (
		<main>
			<App appId={activeModule} updateParentModule={closeModule} />
			<div className='apps'>
				<div>
					<div className='app' id='timberman' onClick={openModule}>
						<img src={timberman} alt='ghost' />
						Timberman
					</div>
					<h3>HS:{snakerecord}</h3>
				</div>
				<div>
					<div className='app' id='flappybird' onClick={openModule}>
						<img src={flappy} alt='ghost' />
						Flappybird
					</div>
					<h3>HS:{flappybirdrecord}</h3>
				</div>
				<div>
					<div className='app' id='snake' onClick={openModule}>
						<img src={apple} alt='ghost' />
						Snake
					</div>
					<h3>HS:{snakerecord}</h3>
				</div>
				<div>
					<div className='app' id='pacman' onClick={openModule}>
						<img src={ghost} alt='ghost' />
						Pacman
					</div>
					<h3>HS:{snakerecord}</h3>
				</div>
				<div>
					<div className='app' id='tower' onClick={openModule}>
						<img src={ghost} alt='ghost' />
						Tower
					</div>
					<h3>HS:{snakerecord}</h3>
				</div>
			</div>
		</main>
	);
}

export default Main;
