import React, { useState } from "react";
import Menu from "./menu";
import Header from "./header";

export default function App() {
	const [gameLoaded, setGameLoaded] = useState(false);

	function animate() {
		const progressBar = document.getElementById("progressBar");
		const duration = 2000;
		// +new Date() parses the current date to ms
		const end = +new Date() + duration;

		const step = () => {
			let current = +new Date();
			let remaining = end - current;

			let rate = 1 - remaining / duration;

			if (progressBar.style.width === '100%') {
				return;
			}

			progressBar.style.width = `${(rate * (100))}%`;

			requestAnimationFrame(step);
		}
		step();
	}

	function performedTask() {
		return new Promise(res => {
			animate();
			setTimeout(() => {
				res();
			}, 2000);
		})
	}

	async function handleLoadGameState() {
		await performedTask();
		setGameLoaded(true);
	}

	return (
		<div id="homePage" className="App">
			<Header />
			{gameLoaded ? <Menu /> :
				<div>
					<a href="#" className="animated-button1 arcade-font" onClick={handleLoadGameState}>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						PLAY
					</a>
					<div id="progressBar"></div>
				</div>}
		</div>
	)
}