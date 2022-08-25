import React, { useCallback, useEffect, useState } from 'react';

const colors = [
	'white',
	'blue',
	'green',
	'red',
	'purple',
	'orange',
	'cyan',
	'darkgreen',
	'darkred',
];

const bombCount = 40;

function Saper() {
	const [arrayDisplay, changeArrayDisplay] = useState([<div key=' '></div>]);
	const [arrayBoard, changeArrayBoard] = useState([[0]]);
	const [flagCount, changeFlagCount] = useState(bombCount);
	const [cellsLeft, changeCellsLeft] = useState(18 * 14 - bombCount);

	const [firstClicked, changefirstClicked] = useState(300);
	const [flag, changeFlag] = useState(0);

	const [gameStarted, changeGameStarted] = useState(false);
	const [gameStopped, stopGame] = useState(false);
	const [gameTime, changeGameTime] = useState(0);

	const board = React.useRef<HTMLDivElement>(null);
	const gameOverText = React.useRef<HTMLHeadingElement>(null);

	const InitiateBoard = () => {
		const array: number[][] = [];
		for (let i = 0; i < 14; i++) {
			const newArray: Array<number> = [];
			for (let i = 0; i < 18; i++) {
				newArray.push(0);
			}
			array[i] = newArray;
		}
		changeArrayBoard(array);
	};

	useEffect(() => {
		InitiateBoard();
	}, []);

	const gameOver = useCallback(() => {
		if (board.current) {
			for (let i = 0; i < arrayDisplay.length; i++) {
				if (board.current.children[i].innerHTML === '*') {
					board.current.children[i].classList.remove('saperFlag');
					board.current.children[i].classList.remove('saperHidden');
					board.current.children[i].classList.add('saperMine');
				}
				board.current.children[i].classList.add('saperBlock');
			}
			if (gameOverText.current) {
				gameOverText.current.innerHTML = 'You lost!';
				gameOverText.current.style.opacity = '100%';
			}
			stopGame(true);
			changeGameStarted(false);
		}
	}, [arrayDisplay.length]);

	useEffect(() => {
		if (cellsLeft === bombCount) {
			if (
				Number(JSON.parse(localStorage.getItem('saperrecord') || '0')) >
					gameTime ||
				JSON.parse(localStorage.getItem('saperrecord') || '0') === 0
			) {
				localStorage.setItem('saperrecord', JSON.stringify(gameTime));
			}
			if (gameOverText.current) {
				gameOverText.current.innerHTML = 'You won!';
				gameOverText.current.style.opacity = '100%';
			}
			stopGame(true);
		}
	}, [cellsLeft, gameTime]);

	const reset = () => {
		InitiateBoard();
		changeCellsLeft(18 * 14 - bombCount);
		changeGameStarted(false);
		stopGame(false);
		changeGameTime(0);
		changeFlagCount(bombCount);
		changefirstClicked(-1);
		changeFlag(0);
		if (gameOverText.current) {
			gameOverText.current.innerHTML = ' ';
			gameOverText.current.style.opacity = '0';
		}
		if (board.current) {
			for (let i = 0; i < arrayDisplay.length; i++) {
				board.current.children[i].classList.add('saperHidden');
				board.current.children[i].classList.remove('saperFlag');
				board.current.children[i].classList.remove('saperMine');
				board.current.children[i].classList.remove('saperBlock');
			}
		}
	};

	const clearBoard = useCallback((target: number) => {
		if (board.current) {
			if (board.current.children[target].classList.contains('saperHidden')) {
				board.current.children[target].classList.remove('saperHidden');
				board.current.children[target].classList.remove('saperFlag');
				if (board.current.children[target].innerHTML === ' ') {
					if ((target + 1) % 18 !== 0) {
						clearBoard(target + 1);
					}
					if ((target + 1) % 18 !== 1) {
						clearBoard(target - 1);
					}
					if (target > 17) {
						clearBoard(target - 18);
					}
					if (target > 17 && (target + 1) % 18 !== 1) {
						clearBoard(target - 19);
					}
					if (target > 17 && (target + 1) % 18 !== 0) {
						clearBoard(target - 17);
					}
					if (target < 234) {
						clearBoard(target + 18);
					}
					if (target < 234 && (target + 1) % 18 !== 1) {
						clearBoard(target + 17);
					}
					if (target < 234 && (target + 1) % 18 !== 0) {
						clearBoard(target + 19);
					}
				}
			}
		}

		const x = document.querySelectorAll('.saperHidden');
		changeCellsLeft(x.length);
	}, []);

	useEffect(() => {
		for (let i = 0; i < arrayBoard.length; i++) {
			for (let j = i; j < arrayBoard.length; j++) {
				if (arrayBoard[i][j] !== 0) {
					changeFlag(1);
				}
			}
		}
		if (firstClicked !== -1 && flag === 1) {
			clearBoard(firstClicked);
			changefirstClicked(-1);
		}
	}, [arrayBoard, firstClicked, flag, clearBoard]);

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>, key: number) => {
			if (!gameStopped) {
				if (gameStarted) {
					if (!e.currentTarget.classList.contains('saperFlag')) {
						if (e.currentTarget.classList.contains('saperHidden')) {
							if (e.currentTarget.innerHTML === ' ' && board.current) {
								clearBoard(key);
							} else if (e.currentTarget.innerHTML === '*') {
								gameOver();
							} else {
								e.currentTarget.classList.remove('saperHidden');
								changeCellsLeft(cellsLeft - 1);
							}
						}
					}
				} else {
					const array = arrayBoard;
					for (let i = 0; i < bombCount; i++) {
						const x = Math.floor(Math.random() * 14);
						const y = Math.floor(Math.random() * 18);
						if (key === x * 18 + y || array[x][y] === 9) {
							i--;
						} else {
							array[x][y] = 9;
						}
					}
					for (let i = 0; i < 14; i++) {
						for (let j = 0; j < 18; j++) {
							if (array[i][j] !== 9) {
								if (array[i][j + 1] === 9) {
									array[i][j]++;
								}
								if (array[i][j - 1] === 9) {
									array[i][j]++;
								}
								if (i !== 0) {
									if (array[i - 1][j] === 9) {
										array[i][j]++;
									}
									if (array[i - 1][j + 1] === 9) {
										array[i][j]++;
									}
									if (array[i - 1][j - 1] === 9) {
										array[i][j]++;
									}
								}
								if (i !== 13) {
									if (array[i + 1][j] === 9) {
										array[i][j]++;
									}
									if (array[i + 1][j - 1] === 9) {
										array[i][j]++;
									}
									if (array[i + 1][j + 1] === 9) {
										array[i][j]++;
									}
								}
							}
						}
					}
					changeArrayBoard(array);
					if (array[Math.floor(key / 18)][key % 18] === 0) {
						changefirstClicked(key);
					} else {
						e.currentTarget.classList.remove('saperHidden');
					}
					changeGameStarted(true);
				}
			}
		},
		[arrayBoard, cellsLeft, gameOver, gameStarted, gameStopped, clearBoard]
	);

	const handleRightClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			if (!gameStopped) {
				if (e.currentTarget.classList.contains('saperFlag')) {
					e.currentTarget.classList.remove('saperFlag');
					changeFlagCount(flagCount + 1);
				} else if (
					flagCount !== 0 &&
					e.currentTarget.classList.contains('saperHidden')
				) {
					e.currentTarget.classList.add('saperFlag');
					changeFlagCount(flagCount - 1);
				}
			}
		},
		[flagCount, gameStopped]
	);

	useEffect(() => {
		if (gameStarted && !gameStopped) {
			const saperInterval = setInterval(() => {
				changeGameTime(gameTime + 1);
			}, 1000);
			return () => clearInterval(saperInterval);
		}
	}, [gameStarted, gameTime, gameStopped]);

	useEffect(() => {
		const newArrayY = arrayBoard
			.reduce((prev, next) => {
				return prev.concat(next);
			})
			.map((elem, index) => {
				return (
					<div
						onClick={(e) => handleClick(e, index)}
						onContextMenu={handleRightClick}
						key={index}
						className='saperCell saperHidden'
						style={{ color: colors[elem] }}
					>
						{elem === 9 ? '*' : elem === 0 ? ' ' : elem}
					</div>
				);
			});
		changeArrayDisplay(newArrayY);
	}, [
		arrayBoard,
		flagCount,
		cellsLeft,
		gameStarted,
		handleClick,
		handleRightClick,
	]);

	return (
		<div className='saper'>
			<div className='saperInfo'>
				<p>Flags left: {flagCount}</p>
				<p>Time: {gameTime}</p>
			</div>
			<h3 ref={gameOverText} style={{ opacity: 0 }}>
				{' '}
			</h3>
			<div className='saperBoard' ref={board}>
				{arrayDisplay}
			</div>
			<button onClick={reset}>Reset</button>
		</div>
	);
}

export default Saper;
