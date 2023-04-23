import React from 'react';
import './style/style.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from './pages/Menu';
import Game from './pages/Game';

function App() {
	return (
		<BrowserRouter>
      <Routes>
        <Route index element={<Menu />}/>
        <Route path="game" element={<Game />} />
      </Routes>
    </BrowserRouter>
	);
}

export default App;
