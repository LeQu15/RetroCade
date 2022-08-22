import React, { useEffect, useState } from 'react';

function FlappyBird() {
	const [birdPosition, changeBirdPosition] = useState(400);
	const [gameStarted, startGame] = useState(false);
	const [gameOver, stopGame] = useState(false);
	const [pipeHeight, setPipeHeight] = useState(100);
	const [pipeDistance, changePipeDistance] = useState(800 - 100);
	const [score, updateScore] = useState(0);
	const [endScreen, updateEndScreen] = useState('none');
	const bottom = 733 - 220 - pipeHeight;
	const bird = React.useRef<HTMLDivElement>(null);

	const flappyJump = () => {
		if (gameStarted) {
			if (birdPosition < 150) {
				changeBirdPosition(0);
			} else {
				changeBirdPosition(birdPosition - 70);
			}
		} else {
			stopGame(false);
			changeBirdPosition(300);
			startGame(true);
			changePipeDistance(800 - 100);
			setPipeHeight(100);
			updateScore(0);
		}
		bird.current?.classList.add('flappyjump');
		setTimeout(() => {
			bird.current?.classList.remove('flappyjump');
		}, 200);
	};

	useEffect(() => {
		if (gameStarted) {
			let timer: NodeJS.Timer;
			if (birdPosition < 800 - 115) {
				timer = setInterval(() => {
					changeBirdPosition(birdPosition + 6);
				}, 24);

				return () => {
					clearInterval(timer);
				};
			} else {
				stopGame(true);
			}
		}
	}, [birdPosition, gameStarted]);

	useEffect(() => {
		if (gameOver) {
			if (JSON.parse(localStorage.getItem('flappyrecord') || '0') < score) {
				localStorage.setItem('flappyrecord', JSON.stringify(score));
			}
			updateEndScreen('flex');
			startGame(false);
		} else {
			updateEndScreen('none');
		}
	}, [gameOver, score]);

	useEffect(() => {
		if (gameStarted) {
			let pipeTimer: NodeJS.Timer;
			if (pipeDistance >= -100) {
				pipeTimer = setInterval(() => {
					changePipeDistance(pipeDistance - 5);
				}, 20);

				return () => {
					clearInterval(pipeTimer);
				};
			} else {
				updateScore(score + 1);
				changePipeDistance(700 - 100);
				setPipeHeight(Math.floor(Math.random() * (733 - 220)));
			}
		}
	}, [gameStarted, pipeDistance, score]);

	useEffect(() => {
		if (
			((birdPosition >= 0 && birdPosition < pipeHeight) ||
				(birdPosition <= 800 && birdPosition >= 670 - bottom)) &&
			pipeDistance >= 100 &&
			pipeDistance <= 160
		) {
			stopGame(true);
		}
	}, [birdPosition, bottom, pipeDistance, pipeHeight]);

	return (
		<div className='flappybird' onClick={flappyJump}>
			<h3>{score}</h3>
			<div className='flappyend' style={{ display: endScreen }}>
				<h3>
					Game Over<span>Score: {score}</span>
				</h3>
				<p>Click anywhere to play again!</p>
			</div>
			<div
				className='bird'
				ref={bird}
				style={{ top: `${birdPosition}px` }}
			></div>
			<div
				className='pipeTop'
				style={{
					top: 0,
					height: pipeHeight + 'px',
					left: pipeDistance + 'px',
				}}
			></div>
			<div
				className='pipeBottom'
				style={{
					top: 733 - (pipeHeight + bottom) + 'px',
					height: bottom + 'px',
					left: pipeDistance + 'px',
				}}
			></div>
		</div>
	);
}

export default FlappyBird;
