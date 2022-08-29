import React, { useCallback, useEffect, useState } from 'react';

function Spaceinvaders() {
	const [score, changeScore] = useState(0);
	const [board, changeBoard] = useState(['']);
	const [display, changeDisplay] = useState([<div key={0}></div>]);
	const [gameStarted, changeGameStarted] = useState(false);
	const [direction, changeDirection] = useState('right');
	const [position, changePosition] = useState(162);
	const [opponents, updateOpponents] = useState([0]);
	const [shootTimeout, changeShootTimeout] = useState(false);
	const [bullets, updateBullets] = useState<Array<number>>([]);
	const [opponentBullets, updateOpponentBullets] = useState<Array<number>>([]);
	const endScreen = React.useRef<HTMLDivElement>(null);

	const createBoard = useCallback(() => {
		const array = [];
		const opponentsArray: Array<number> = [];
		for (let i = 0; i < 13 * 14; i++) {
			array.push('');
		}
		for (let i = 0; i < 5; i++) {
			for (let j = 15 + 13 * i; j < 24 + 13 * i; j++) {
				array[j] = 'opponent';
				opponentsArray.push(j);
			}
		}

		array[162] = 'player';

		changeBoard(array);
		updateOpponents(opponentsArray);
		updateBullets([]);
		updateOpponentBullets([]);
		changeDirection('right');
		updateDisplay(array);
		changePosition(162);
		changeScore(0);
	}, []);

	useEffect(() => {
		createBoard();
	}, [createBoard]);

	const startGame = () => {
		createBoard();
		if (endScreen.current) {
			endScreen.current.style.display = 'none';
		}
		changeGameStarted(true);
	};

	const updateDisplay = (array: Array<string>) => {
		const newArray = array.map((elem, index) => (
			<div key={index} className={`spaceCell ${elem}`}></div>
		));
		changeDisplay(newArray);
	};

	const goLeft = useCallback(() => {
		if (gameStarted) {
			const array = board;
			if (position % 13 !== 0) {
				changePosition(position - 1);
				array[position] = '';
				array[position - 1] = 'player';
			}
			updateDisplay(array);
		}
	}, [board, position, gameStarted]);

	const goRight = useCallback(() => {
		if (gameStarted) {
			const array = board;
			if ((position + 1) % 13 !== 0) {
				changePosition(position + 1);
				array[position] = '';
				array[position + 1] = 'player';
			}
			updateDisplay(array);
		}
	}, [board, position, gameStarted]);

	const shoot = useCallback(() => {
		if (!shootTimeout && gameStarted) {
			const array = bullets;
			array.push(position);
			updateBullets(array);
			changeShootTimeout(true);
			setTimeout(() => {
				changeShootTimeout(false);
			}, 300);
		}
	}, [shootTimeout, bullets, position, gameStarted]);

	const movePlayer = useCallback(
		(e: KeyboardEvent) => {
			e.preventDefault();
			if (gameStarted) {
				if (e.key === 'ArrowRight' || e.key === 'd') {
					goRight();
				} else if (e.key === 'ArrowLeft' || e.key === 'a') {
					goLeft();
				} else if (e.key === ' ') {
					shoot();
				}
			}
		},
		[gameStarted, goLeft, goRight, shoot]
	);

	const stopGame = useCallback(() => {
		changeGameStarted(false);
		if (endScreen.current) {
			endScreen.current.style.display = 'flex';
			endScreen.current.children[0].textContent = 'Reset';
		}
	}, []);

	useEffect(() => {
		if (gameStarted) {
			document.addEventListener('keydown', movePlayer);
		} else {
			document.removeEventListener('keydown', movePlayer);
		}
		return () => {
			document.removeEventListener('keydown', movePlayer);
		};
	}, [movePlayer, gameStarted]);

	useEffect(() => {
		if (opponents.length === 0 && gameStarted) {
			const array = [];
			const opponentsArray: Array<number> = [];
			for (let i = 0; i < 13 * 14; i++) {
				array.push('');
			}
			for (let i = 0; i < 5; i++) {
				for (let j = 15 + 13 * i; j < 24 + 13 * i; j++) {
					array[j] = 'opponent';
					opponentsArray.push(j);
				}
			}

			array[position] = 'player';

			changeBoard(array);
			updateOpponents(opponentsArray);
			updateDisplay(array);
			changeDirection('left');
			updateBullets([]);
			updateOpponentBullets([]);
			changeGameStarted(true);
		}
	}, [opponents.length, gameStarted, createBoard, position]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (gameStarted) {
				const newArray = board;
				const opponentsPosition = opponents;
				for (let i = 0; i < 14 * 13; i++) {
					if (newArray[i].includes('opponent')) {
						newArray[i] = '';
					}
				}

				if (
					(opponentsPosition.some((e) => (e + 1) % 13 === 0) &&
						direction === 'right') ||
					(opponentsPosition.some((e) => e % 13 === 0) && direction === 'left')
				) {
					opponentsPosition.forEach((e, i) => (opponentsPosition[i] = e + 13));
					if (direction === 'right') {
						changeDirection('left');
					} else {
						changeDirection('right');
					}
				} else {
					if (direction === 'right') {
						opponentsPosition.forEach((e, i) => (opponentsPosition[i] = e + 1));
					} else {
						opponentsPosition.forEach((e, i) => (opponentsPosition[i] = e - 1));
					}
				}
				if (!opponentsPosition.some((el) => el > 155)) {
					opponentsPosition.forEach((elem) => (newArray[elem] = 'opponent'));
					changeBoard(newArray);
					updateOpponents(opponentsPosition);
					updateDisplay(newArray);
				} else {
					stopGame();
				}
			} else {
				clearInterval(intervalId);
			}
		}, 30 * opponents.length + 135);
		return () => {
			clearInterval(intervalId);
		};
	}, [board, gameStarted, direction, opponents, opponentBullets, stopGame]);

	useEffect(() => {
		if (
			JSON.parse(localStorage.getItem('spaceinvadersrecord') || '0') < score &&
			!gameStarted
		) {
			localStorage.setItem('spaceinvadersrecord', JSON.stringify(score));
		}
	}, [stopGame, score, gameStarted]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const opponentsPosition = opponents;
			const flag = Math.floor(Math.random() * 4);
			if ([1, 2].includes(flag)) {
				const array = opponentBullets;
				array.push(
					opponentsPosition[
						Math.floor(Math.random() * opponentsPosition.length)
					]
				);
				updateOpponentBullets(array);
			}
		}, 1500);
		return () => {
			clearInterval(intervalId);
		};
	}, [opponentBullets, opponents]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (gameStarted) {
				const newArray = board;
				const opponentsPosition = opponents;
				const bulletsArray = bullets;
				const oppBulletsArray = opponentBullets;
				for (let i = 0; i < 14 * 13; i++) {
					if (newArray[i] === 'bullet' || newArray[i] === 'oppbullet') {
						newArray[i] = '';
					}
				}

				bulletsArray.forEach((e, index) => (bulletsArray[index] = e - 13));
				bulletsArray.forEach((elem) => (newArray[elem] = 'bullet'));
				oppBulletsArray.forEach(
					(e, index) => (oppBulletsArray[index] = e + 13)
				);

				for (let i = 0; i < oppBulletsArray.length; i++) {
					if (oppBulletsArray[i] >= 182) {
						oppBulletsArray.splice(i, 1);
					}
				}
				for (let i = 0; i < bulletsArray.length; i++) {
					if (
						bulletsArray[i] < 0 ||
						oppBulletsArray.some((el) => el === bulletsArray[i]) ||
						oppBulletsArray.some((el) => el + 13 === bulletsArray[i])
					) {
						bulletsArray.splice(i, 1);
					}
				}
				oppBulletsArray.forEach((elem) => {
					if (newArray[elem] === 'opponent') {
						newArray[elem] = 'opponent oppbullet';
					} else if (newArray[elem] !== 'player') {
						newArray[elem] = 'oppbullet';
					} else {
						stopGame();
					}
				});

				for (let i = 0; i < bulletsArray.length; i++) {
					for (let j = 0; j < opponentsPosition.length; j++) {
						if (opponentsPosition[j] === bulletsArray[i]) {
							newArray[opponentsPosition[j]] = '';
							opponentsPosition.splice(j, 1);
							bulletsArray.splice(i, 1);
							changeScore(score + 100);
						}
					}
				}
				changeBoard(newArray);
				updateOpponents(opponentsPosition);
				updateDisplay(newArray);
				updateBullets(bulletsArray);
			}
		}, 150);
		return () => {
			clearInterval(intervalId);
		};
	}, [
		bullets,
		board,
		gameStarted,
		opponents,
		score,
		opponentBullets,
		stopGame,
	]);

	return (
		<div className='spaceinvaders'>
			<div ref={endScreen} onClick={startGame} className='spaceEnd'>
				<button>Start</button>
			</div>
			<h3>{score}</h3>
			<div className='spaceBoard'>{display}</div>
			<div className='spacecontrols' tabIndex={-1}>
				<button onClick={goLeft} tabIndex={-1}>
					Left
				</button>
				<button onClick={goRight}>Right</button>
				<button onClick={shoot}>Shoot</button>
			</div>
		</div>
	);
}

export default Spaceinvaders;
