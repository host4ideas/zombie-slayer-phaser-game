import React from "react";

export default function HowMade() {
	return (
		<div className="how-was-made">
			<div>
				This proyect has been made using Phaser as the library for the entire game and React for the website itself,
				all based in the following template:
				<a href="https://github.com/kevinshen56714/create-react-phaser3-app">Link to template</a>
			</div>

			<br />
			<br />

			<div id="packages">
				List of used packages:
				<ol>
					<li>
						<ul>
							<li id="phaser">
								<h3>- PHASER -</h3>
								<dl>
									<dt>Functionality:</dt>
									<dd>A fast, free and fun open source framework for Canvas and WebGL powered browser games.</dd>
									<dt>Source:</dt>
									<dd><a href="https://phaser.io/">phaser oficial page</a></dd>
								</dl>
							</li>
							<li id="react">
								<h3>- REACT -</h3>
								<dl>
									<dt>Functionality:</dt>
									<dd>React is a JavaScript library for creating user interfaces.</dd>
									<dt>Source:</dt>
									<dd><a href="https://www.npmjs.com/package/react">react npm page</a></dd>
								</dl>
							</li>
							<li id="create-react-app">
								<h3>- create react app -</h3>
								<dl>
									<dt>Functionality:</dt>
									<dd>This package includes the global command for Create React App.</dd>
									<dt>Source:</dt>
									<dd><a href="https://www.npmjs.com/package/create-react-app">create-react-app npm page</a></dd>
								</dl>
							</li>
						</ul>
					</li>
				</ol>
			</div>
			<br />
			<br />
			<div id="installation">
				<h3>In order to configure the project run the following command in the project root folder:</h3>

				<p>npm install</p>

			</div>
			<div id="run-project">
				<h3>In order to run the project, run the following command in root:</h3>

				<h4>- npm run start -</h4>

				<p>Runs the app in the development mode. Open <a href="http://localhost:3000">http://localhost:3000</a> to view it in the browser.</p>

				<br />

				<h4>- yarn build or npm run build -</h4>

				Builds the app for production to the `build` folder.\
				It correctly bundles React in production mode and optimizes the build for the best performance.
			</div>
		</div>
	);
}