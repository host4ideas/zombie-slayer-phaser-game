import React from "react";
import logo from '../logo.svg';
import phaserLogo from '../phaser-logo.png';

export default function Header() {
	return (
		<header className="App-header">
			<img src={logo} className="App-logo react-logo" alt="logo" />
			<h1 className="horror-text">ZOMBIE SLAYER</h1>
			<img src={phaserLogo} className="App-logo phaser-logo" alt="phaser-logo" />
		</header>
	)
}