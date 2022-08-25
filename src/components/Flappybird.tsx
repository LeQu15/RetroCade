import React, { useEffect, useState } from 'react';
import scoreSound from '../sound/sfx_point.mp3';
import jumpSound from '../sound/sfx_wing.mp3';
import deathSound from '../sound/sfx_die.mp3';

function FlappyBird() {
	const flappyscreen = React.useRef<HTMLDivElement>(null);
	const [birdPosition, changeBirdPosition] = useState(400);
	const [gameStarted, startGame] = useState(false);
	const [gameOver, stopGame] = useState(false);
	const [pipeHeight, setPipeHeight] = useState(100);
	const [pipeDistance, changePipeDistance] = useState(800 - 100);
	const [score, updateScore] = useState(0);
	const [endScreen, updateEndScreen] = useState('none');
	const [birdJumped, changeBirdJump] = useState(false);
	const bottom = 800 - 180 - pipeHeight;
	const bird = React.useRef<HTMLDivElement>(null);

	const flappyJump = () => {
		if (gameStarted) {
			if (birdPosition < 150) {
				changeBirdPosition(0);
			} else {
				changeBirdPosition(birdPosition - 100);
				changeBirdJump(true);
			}
		} else {
			stopGame(false);
			changeBirdPosition(300);
			startGame(true);
			changePipeDistance(800 - 100);
			setPipeHeight(100);
			updateScore(0);
		}
		new Audio(jumpSound).play();
		bird.current?.classList.add('flappyjump');
		setTimeout(() => {
			bird.current?.classList.remove('flappyjump');
		}, 200);
	};

	useEffect(() => {
		if (gameStarted) {
			if (!birdJumped) {
				if (birdPosition < 800) {
					const timer = setInterval(() => {
						changeBirdPosition(birdPosition + 8);
					}, 20);

					return () => {
						clearInterval(timer);
					};
				} else {
					stopGame(true);
				}
			} else {
				setTimeout(() => {
					changeBirdJump(false);
				}, 200);
			}
		}
	}, [birdPosition, gameStarted, birdJumped]);

	useEffect(() => {
		if (gameOver) {
			if (JSON.parse(localStorage.getItem('flappyrecord') || '0') < score) {
				localStorage.setItem('flappyrecord', JSON.stringify(score));
			}
			new Audio(deathSound).play();
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
					changePipeDistance(pipeDistance - 7);
				}, 20);

				return () => {
					clearInterval(pipeTimer);
				};
			} else {
				updateScore(score + 1);
				new Audio(scoreSound).play();
				changePipeDistance(800 - 100);
				setPipeHeight(Math.floor(Math.random() * (800 - 180)));
			}
		}
	}, [gameStarted, pipeDistance, score]);

	useEffect(() => {
		if (
			((birdPosition >= 0 && birdPosition < pipeHeight) ||
				(birdPosition <= 800 && birdPosition >= 800 - bottom)) &&
			pipeDistance >= 100 &&
			pipeDistance <= 160
		) {
			stopGame(true);
		}
	}, [birdPosition, bottom, pipeDistance, pipeHeight]);

	return (
		<div className='flappybird' onClick={flappyJump} ref={flappyscreen}>
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
					top: 800 - (pipeHeight + bottom) + 'px',
					height: bottom + 'px',
					left: pipeDistance + 'px',
				}}
			></div>
		</div>
	);
}

export default FlappyBird;
