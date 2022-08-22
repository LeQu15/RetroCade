import React, { useCallback, useEffect, useState } from 'react';

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

function Snake() {
	const [arrayBoard, changeArray] = useState(['']);
	const [displayBoard, changeDisplay] = useState([<div key={0}></div>]);
	const [score, updateScore] = useState(0);
	const [direction, changeDirection] = useState('none');
	const [snake, changeSnake] = useState([124, 125, 126, 127]);
	const [gameOverFlag, stopGame] = useState(false);
	const [buttonStatus, changeButtonStatus] = useState('0%');
	const snakeTitle = React.useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		startGame();
	}, []);

	const startGame = () => {
		const array: Array<string> = [];
		for (let i = 0; i < 17 * 15; i++) {
			array.push('');
		}
		const x = array;
		changeArray(x);
	};

	useEffect(() => {
		if (arrayBoard.length > 2) {
			let x = arrayBoard;
			if (!arrayBoard.includes('coin')) {
				let position = Math.floor(Math.random() * 255);
				while (snake.includes(position)) {
					position = Math.floor(Math.random() * 255);
				}
				x[position] = 'coin';
			}
		}
		if (score === 252) {
			stopGame(true);
			changeButtonStatus('100%');
		}
	}, [arrayBoard, score, snake]);

	useEffect(() => {
		if (arrayBoard.length > 2) {
			let x = arrayBoard;
			for (let i = 0; i < x.length; i++) {
				if (x[i] !== 'coin') {
					x[i] = '';
				}
			}
			snake.forEach((e) => (x[e] = 'snakeBody'));
			switch (direction) {
				case 'right':
					x[snake[snake.length - 1]] = 'snakeHead right';
					break;
				case 'left':
					x[snake[snake.length - 1]] = 'snakeHead left';
					break;
				case 'up':
					x[snake[snake.length - 1]] = 'snakeHead up';
					break;
				case 'down':
					x[snake[snake.length - 1]] = 'snakeHead down';
					break;
				default:
					x[snake[snake.length - 1]] = 'snakeHead right';
			}
		}
	}, [arrayBoard, snake, direction]);

	const resetGame = () => {
		changeArray(['']);
		changeDisplay([<div key={0}></div>]);
		updateScore(0);
		changeDirection('none');
		changeSnake([124, 125, 126, 127]);
		stopGame(false);
		if (snakeTitle.current) {
			snakeTitle.current.innerHTML = `${score}`;
		}
		changeButtonStatus('0%');
		startGame();
	};

	const checkDirection = () => {
		if (Math.abs(touchendY - touchstartY) < Math.abs(touchendX - touchstartX)) {
			if (touchendX < touchstartX) {
				if (
					direction !== 'right' &&
					direction !== 'left' &&
					direction !== 'none'
				) {
					changeDirection('left');
					document.removeEventListener('keydown', handleChangeDirection);
				}
			}
			if (touchendX > touchstartX) {
				if (direction !== 'left' && direction !== 'right') {
					changeDirection('right');
					document.removeEventListener('keydown', handleChangeDirection);
				}
			}
		} else {
			if (touchendY < touchstartY) {
				if (direction !== 'down' && direction !== 'up') {
					changeDirection('up');
					document.removeEventListener('keydown', handleChangeDirection);
				}
			}
			if (touchendY > touchstartY) {
				if (direction !== 'up' && direction !== 'down') {
					changeDirection('down');
					document.removeEventListener('keydown', handleChangeDirection);
				}
			}
		}
	};

	const handleTouchStart = (e: any) => {
		touchstartX = e.changedTouches[0].screenX;
		touchstartY = e.changedTouches[0].screenY;
	};

	const handleTouchEnd = (e: any) => {
		touchendX = e.changedTouches[0].screenX;
		touchendY = e.changedTouches[0].screenY;
		checkDirection();
	};

	const handleChangeDirection = useCallback(
		(e: KeyboardEvent) => {
			switch (e.key) {
				case 'w':
				case 'ArrowUp':
					if (direction !== 'down' && direction !== 'up') {
						changeDirection('up');
						document.removeEventListener('keydown', handleChangeDirection);
					}
					break;
				case 's':
				case 'ArrowDown':
					if (direction !== 'up' && direction !== 'down') {
						changeDirection('down');
						document.removeEventListener('keydown', handleChangeDirection);
					}
					break;
				case 'd':
				case 'ArrowRight':
					if (direction !== 'left' && direction !== 'right') {
						changeDirection('right');
						document.removeEventListener('keydown', handleChangeDirection);
					}
					break;
				case 'a':
				case 'ArrowLeft':
					if (
						direction !== 'right' &&
						direction !== 'left' &&
						direction !== 'none'
					) {
						changeDirection('left');
						document.removeEventListener('keydown', handleChangeDirection);
					}
					break;
				default:
			}
		},
		[direction]
	);

	useEffect(() => {
		if (gameOverFlag) {
			if (JSON.parse(localStorage.getItem('snakerecord') || '0') < score) {
				localStorage.setItem('snakerecord', JSON.stringify(score));
			}
			document.removeEventListener('keydown', handleChangeDirection);
			if (snakeTitle.current) {
				snakeTitle.current.innerHTML = `Game Over! <span>Score: ${score}</span>`;
			}
			changeButtonStatus('100%');
		}
	}, [gameOverFlag, score, handleChangeDirection]);

	useEffect(() => {
		if (!gameOverFlag) {
			const intervalId = setTimeout(() => {
				document.addEventListener('keydown', handleChangeDirection);
				const newSnake = [...snake];
				switch (direction) {
					case 'right':
						if (newSnake[newSnake.length - 1] % 17 !== 16) {
							newSnake.push(newSnake[newSnake.length - 1] + 1);
							if (newSnake.includes(arrayBoard.indexOf('coin'))) {
								updateScore(score + 1);
							} else {
								newSnake.shift();
							}
						} else {
							stopGame(true);
						}
						break;
					case 'left':
						if (newSnake[newSnake.length - 1] % 17 !== 0) {
							newSnake.push(newSnake[newSnake.length - 1] - 1);
							if (newSnake.includes(arrayBoard.indexOf('coin'))) {
								updateScore(score + 1);
							} else {
								newSnake.shift();
							}
						} else {
							stopGame(true);
						}
						break;
					case 'up':
						if (newSnake[newSnake.length - 1] > 17) {
							newSnake.push(newSnake[newSnake.length - 1] - 17);
							if (newSnake.includes(arrayBoard.indexOf('coin'))) {
								updateScore(score + 1);
							} else {
								newSnake.shift();
							}
						} else {
							stopGame(true);
						}
						break;
					case 'down':
						if (newSnake[newSnake.length - 1] < 238) {
							newSnake.push(newSnake[newSnake.length - 1] + 17);
							if (newSnake.includes(arrayBoard.indexOf('coin'))) {
								updateScore(score + 1);
							} else {
								newSnake.shift();
							}
						} else {
							stopGame(true);
						}
						break;
					default:
				}
				clearTimeout(intervalId);
				let flag = 0;
				for (let i = 0; i < newSnake.length; i++) {
					for (let j = i + 1; j < newSnake.length; j++) {
						if (newSnake[i] === newSnake[j]) flag = 1;
					}
				}
				if (flag === 0) {
					changeSnake(newSnake);
				} else {
					stopGame(true);
				}
			}, 250);

			return () => {
				clearTimeout(intervalId);
			};
		}
	}, [
		direction,
		snake,
		handleChangeDirection,
		arrayBoard,
		gameOverFlag,
		score,
	]);

	useEffect(() => {
		const array = arrayBoard.map((elem, index) => (
			<div key={index} className={`board ${elem}`}></div>
		));
		changeDisplay(array);
	}, [arrayBoard, snake]);

	return (
		<div
			className='snake'
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			<h1 ref={snakeTitle}>{score}</h1>
			<div className='snakeBoard'>{displayBoard}</div>
			<button style={{ opacity: buttonStatus }} onClick={resetGame}>
				Play again!
			</button>
		</div>
	);
}

export default Snake;
