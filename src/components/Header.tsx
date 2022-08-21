import React, { useEffect, useState } from 'react';
import ghost from '../img/ghost.png';

function Header() {
	const [time, updateTime] = useState('');

	useEffect(() => {
		const intervalTime = setInterval(() => {
			const currentTime = new Date();
			const hour =
				currentTime.getHours() < 10
					? '0' + currentTime.getHours()
					: currentTime.getHours().toString();
			const minutes =
				currentTime.getMinutes() < 10
					? '0' + currentTime.getMinutes()
					: currentTime.getMinutes().toString();
			const fullDate = `${hour}:${minutes}`;
			updateTime(fullDate);
		}, 1000);

		return () => {
			clearInterval(intervalTime);
		};
	});

	return (
		<header>
			<div className='title'>
				<img src={ghost} alt='ghost' />
				<h1>ArcadeClassic</h1>
			</div>
			<div className='date'>{time}</div>
		</header>
	);
}

export default Header;
