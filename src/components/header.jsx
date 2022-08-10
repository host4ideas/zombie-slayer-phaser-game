import React from "react";
import reactLogo from '../assets/react-logo.svg';
import phaserLogo from '../assets/phaser-logo.png';

export default function Header() {
	return (
		<header className="App-header">
			<img src={reactLogo} className="App-logo react-logo" alt="React logo" />
			<h1 className="horror-text">ZOMBIE SLAYER</h1>
			<img src={phaserLogo} className="App-logo phaser-logo" alt="Phaser logo" />
		</header>
	)
}