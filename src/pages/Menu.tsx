import React from 'react';
import '../style/style.scss';
import ghost from '../img/ghost.png';
import LoadGames from '../components/LoadGames';

function Menu() {
	return (
		<>
			<header>
            <button className='hiddenBtn'><i className="fa-solid fa-caret-left"></i></button>
        <h1>RetroCade</h1>
        <img src={ghost} alt='ghost'></img>
      </header>
      <main>
        <div className="gamesList">
        <LoadGames/>
        </div>
      </main>
      <footer><a href="https://github.com/LeQu15" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a></footer>
		</>
	);
}

export default Menu;