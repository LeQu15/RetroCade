import React, { useState } from 'react';
import flappy from '../img/flappy.png';
import apple from '../img/apple.png';
import timberman from '../img/timberman.png';
import saper from '../img/saper.png';
import spaceinvaders from '../img/spaceinvaders.png';
import candy from '../img/candy.png';
import App from './App';

function Main() {
	const snakerecord = JSON.parse(localStorage.getItem('snakerecord') || '0');
	const flappybirdrecord = JSON.parse(
		localStorage.getItem('flappyrecord') || '0'
	);
	const saperrecord = JSON.parse(localStorage.getItem('saperrecord') || '0');
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
						<img src={timberman} alt='timberman' />
						Timberman
					</div>
					<h3>HS:{snakerecord}</h3>
				</div>
				<div>
					<div className='app' id='flappybird' onClick={openModule}>
						<img src={flappy} alt='flappybird' />
						Flappybird
					</div>
					<h3>HS:{flappybirdrecord}</h3>
				</div>
				<div>
					<div className='app' id='snake' onClick={openModule}>
						<img src={apple} alt='snake' />
						Snake
					</div>
					<h3>HS:{snakerecord}</h3>
				</div>
				<div>
					<div className='app' id='spaceinvaders' onClick={openModule}>
						<img src={spaceinvaders} alt='spaceinvaders' />
						Space Invaders
					</div>
					<h3>HS:{snakerecord}</h3>
				</div>
				<div>
					<div className='app' id='candycrush' onClick={openModule}>
						<img src={candy} alt='candycrush' />
						Candy crush
					</div>
					<h3>HS:{snakerecord}</h3>
				</div>
				<div>
					<div className='app' id='saper' onClick={openModule}>
						<img src={saper} alt='saper' />
						Saper
					</div>
					<h3>HS:{saperrecord}s</h3>
				</div>
			</div>
		</main>
	);
}

export default Main;
