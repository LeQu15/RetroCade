import React, {useState, useEffect } from 'react';
import games from '../data/games.js';
import {useNavigate} from "react-router-dom";

function LoadGames() {
    const navigate = useNavigate();
    const [displayBoard, changeDisplay] = useState([<div key={0}></div>]);



    useEffect(() => {
        const array = [];
        let object;
        games.sort(function(a,b) {
            let x = a.gameName.toLowerCase();
            let y = b.gameName.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        for(let i = 0; i < games.length; i++) {
            object = {
                //eslint-disable-next-line
                img: <img src={require('../img/logos/' + 'saperlogo' + '.png')} alt="icon"></img>,
                title: <p>{games[i].gameName}</p>,
                play: <button className="play" onClick={() => {navigate('/game', { state: { Id: games[i].gameId } });}}><i className="fa-solid fa-caret-right"></i></button>
            }
            array.push(
                <div key={i} className="game">{object.img}{object.title}{object.play}</div>
    )
        }
        changeDisplay(array)
    }, [navigate])

    

	return (
		<>
        {displayBoard}
		</>
	);
}

export default LoadGames;