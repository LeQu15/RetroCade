import React from 'react';
import '../style/style.scss';
import ghost from '../img/ghost.png';
import { useLocation, useNavigate } from 'react-router-dom';

function Game() {
    const {state} = useLocation();
    const {Id} = state;
    const navigate = useNavigate();
	return (
		<>
			<header>
            <button onClick={() => {navigate('/')}}><i className="fa-solid fa-caret-left"></i></button>
        <h1>RetroCade</h1>
        <img src={ghost} alt='ghost'></img>
        
      </header>
      <main>
            <p className="info">{Id}</p>
            <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </main>
      <footer><a href="https://github.com/LeQu15" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a></footer>
		</>
	);
}

export default Game;
