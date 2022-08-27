import React, { useCallback, useEffect, useState } from 'react';

function Timberman() {
	const [tree, changeTree] = useState([0, 0, 0, 0, 0, 0]);
	const [displayTree, changeDisplayTree] = useState([<div key={0}></div>]);
	const [score, changeScore] = useState(0);
	const [gameStarted, changeGameStarted] = useState(false);
	const [timer, changeTimer] = useState(6000);
	const [flag, changeFlag] = useState(false);
	const gameOverScreen = React.useRef<HTMLDivElement>(null);
	const timberguy = React.useRef<HTMLDivElement>(null);
	const timberrightscreen = React.useRef<HTMLDivElement>(null);
	const timberleftscreen = React.useRef<HTMLDivElement>(null);

	const updateTree = useCallback(() => {
		if (
			gameOverScreen.current &&
			timberrightscreen.current &&
			timberleftscreen.current
		) {
			gameOverScreen.current.style.display = 'none';
			timberrightscreen.current.style.pointerEvents = 'auto';
			timberleftscreen.current.style.pointerEvents = 'auto';
		}
		changeFlag(false);
		const array: Array<number> = [];
		for (let i = 0; i < 2; i++) {
			let number = Math.floor(Math.random() * 7 + 1);
			if ([1, 3, 5].includes(number)) {
				number = 0;
			} else if (number !== 7) {
				number = 1;
			} else number = 2;
			array.push(number);
			array.push(2);
		}
		array.push(3, 3);
		changeTree(array);
		updateDisplay(array);
	}, []);

	const gameOver = useCallback(() => {
		if (
			gameOverScreen.current &&
			timberrightscreen.current &&
			timberleftscreen.current
		) {
			gameOverScreen.current.style.display = 'flex';
			timberleftscreen.current.style.pointerEvents = 'none';
			timberrightscreen.current.style.pointerEvents = 'none';
		}
		if (
			Number(JSON.parse(localStorage.getItem('timberrecord') || '0')) < score
		) {
			localStorage.setItem('timberrecord', JSON.stringify(score));
		}
		changeFlag(true);
	}, [score]);

	const breakTree = useCallback(() => {
		const array = tree;
		array.pop();
		if (array[0] === 1 || array[0] === 0) {
			array.unshift(2);
		} else {
			let number = Math.floor(Math.random() * 7 + 1);
			if ([1, 3, 5].includes(number)) {
				number = 0;
			} else if (number !== 7) {
				number = 1;
			} else number = 2;
			array.unshift(number);
			if (timer + 250 > 6000) {
				changeTimer(6000);
			} else {
				changeTimer(timer + 250);
			}
		}
		changeTree(array);
		updateDisplay(array);
		changeScore(score + 1);
	}, [score, timer, tree]);

	const chopTree = useCallback(
		(e: KeyboardEvent) => {
			if (!flag) {
				if (e.key === 'ArrowLeft') {
					timberguy.current?.classList.remove('right');
					timberguy.current?.classList.add('left');
					if (!gameStarted) {
						changeGameStarted(true);
					}
					if (tree[tree.length - 2] === 0 || tree[tree.length - 1] === 0) {
						gameOver();
					} else {
						breakTree();
					}
				} else if (e.key === 'ArrowRight') {
					timberguy.current?.classList.remove('left');
					timberguy.current?.classList.add('right');
					if (!gameStarted) {
						changeGameStarted(true);
					}
					if (tree[tree.length - 2] === 1 || tree[tree.length - 1] === 1) {
						gameOver();
					} else {
						breakTree();
					}
				}
			} else {
				document.removeEventListener('keydown', chopTree);
			}
		},
		[tree, gameStarted, breakTree, flag, gameOver]
	);

	const chopLeft = () => {
		if (!flag) {
			timberguy.current?.classList.remove('right');
			timberguy.current?.classList.add('left');
			if (!gameStarted) {
				changeGameStarted(true);
			}
			if (tree[tree.length - 2] === 0 || tree[tree.length - 1] === 0) {
				gameOver();
			} else {
				breakTree();
			}
		}
	};

	const chopRight = () => {
		if (!flag) {
			timberguy.current?.classList.remove('left');
			timberguy.current?.classList.add('right');
			if (!gameStarted) {
				changeGameStarted(true);
			}
			if (tree[tree.length - 2] === 1 || tree[tree.length - 1] === 1) {
				gameOver();
			} else {
				breakTree();
			}
		}
	};
	useEffect(() => {
		document.addEventListener('keydown', chopTree);
		return () => {
			document.removeEventListener('keydown', chopTree);
		};
	}, [chopTree]);

	const updateDisplay = (array: Array<number>) => {
		const x = array.map((elem, index) => (
			<div
				key={index}
				className={`tree ${
					elem === 0 ? 'treeleft' : elem === 1 ? 'treeright' : ''
				}`}
			></div>
		));
		changeDisplayTree(x);
	};

	useEffect(() => {
		updateTree();
	}, [updateTree]);

	useEffect(() => {
		let intervalId: NodeJS.Timer;
		if (gameStarted && !flag) {
			intervalId = setInterval(() => {
				if (timer - 40 < 0) {
					changeTimer(0);
				} else {
					changeTimer(timer - 40);
				}
			}, 40);
			if (timer <= 0) {
				gameOver();
				clearInterval(intervalId);
			}
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [gameStarted, timer, flag, gameOver]);

	const resetGame = () => {
		updateTree();
		timberguy.current?.classList.remove('right');
		timberguy.current?.classList.remove('left');
		changeScore(0);
		changeGameStarted(false);
		changeTimer(6000);
		changeFlag(false);
	};

	return (
		<div className='timberman' tabIndex={0}>
			<div
				className='timberleftscreen'
				onClick={chopLeft}
				ref={timberleftscreen}
			></div>
			<div
				className='timberrightscreen'
				onClick={chopRight}
				ref={timberrightscreen}
			></div>
			<h3 className='timberscore'>{score}</h3>
			<div className='timbertimer'>
				<div style={{ width: Math.floor(timer / 60) + '%' }}></div>
			</div>
			<div className='timbergameover' ref={gameOverScreen}>
				<p>Game Over!</p>
				<p>Your score: {score}</p>
				<button onClick={resetGame}>Reset</button>
			</div>
			<div className='timbermanTree'>
				{displayTree}
				<div className='timbermanguy' ref={timberguy}></div>
			</div>
			<div className='timbergrass'></div>
		</div>
	);
}

export default Timberman;
