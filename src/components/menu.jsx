// React
import React, { useState } from "react";
import Instructions from "./Instructions";
import HowMade from "./HowWasMade";
// Phaser
import Phaser from "phaser";
import config from "../PhaserGame";
// Audio controller
import audioController from "../audioController";
// Option hover audio
import menuOptionAudio from "../assets/audio/menu/Menu-Selection-Change-D2.mp3";

// Defines the menu that appears in the home page
export default function Menu() {
    // Set a control variable to check to render or not some web parts
    const [instrClicked, setInstrClicked] = useState(false);
    // Set a control variable to check to render or not some web parts
    const [howMadeClicked, setHowMadeClicked] = useState(false);
    // Set a control variable to check to render or not some web parts
    const [newGame, setNewGame] = useState();
    // Game paused state
    const [gamePaused, setGamePaused] = useState(false);
    // Audio loaded state
    const [firstLoad, setFirstLoad] = useState(false);

    if (!firstLoad) {
        setFirstLoad(true);

        audioController.pauseAllAudios();

        // First ST song
        audioController.playRandomST();

        // Random ST song each 5 minutes
        setInterval(() => {
            audioController.pauseAllAudios();

            // First song ST
            audioController.playRandomST();
        }, 300000);
    }

    document.addEventListener("keypress", (ev) => {
        if (ev.key === "p" || ev.key === "P") {
            if (gamePaused) {
                // Resume and show the game
                newGame.scene.resume("mainscene");
                document.getElementById("phaser-container").style.visibility =
                    "initial";
                setGamePaused(false);
            } else {
                // Pause and hide the game (show the initial menu)
                document.getElementById("phaser-container").style.visibility =
                    "hidden";
                newGame.scene.pause("mainscene");
                setGamePaused(true);
                audioController.pauseAllAudios();
            }
        }
    });

    const handleHover = () => {
        const optionSound = new Audio(menuOptionAudio);
        optionSound.play();
    };

    function handleClickNewGame() {
        if (typeof newGame == "object") {
            /*
			The first argument of the destroy method, true, 
			says that I want to remove the game from the canvas element of the page when I destroy the game. 
			The second argument, false, says to NOT remove all of Phaser and its plugins for the page.
			*/
            newGame.destroy(true, false);
            // Show the game
            document.getElementById("phaser-container").style.visibility =
                "initial";
        }
        audioController.adjustVolume(0.3);
        setNewGame(new Phaser.Game(config));
    }

    function handleClickHowMade() {
        setInstrClicked(false);
        if (howMadeClicked) {
            setHowMadeClicked(false);
            document.body.style.overflowY = "hidden";
        } else {
            setHowMadeClicked(true);
            document.body.style.overflowY = "auto";
        }
    }

    function handleClickInstr() {
        setHowMadeClicked(false);
        if (instrClicked) {
            setInstrClicked(false);
            document.body.style.overflowY = "hidden";
        } else {
            setInstrClicked(true);
            document.body.style.overflowY = "auto";
        }
    }

    return (
        <div className="menu-options">
            {/* Option menu with three default options */}
            <div className="menu-option arcade-font">
                <h2
                    id="startGame"
                    className="text-option"
                    onClick={handleClickNewGame}
                    onMouseEnter={handleHover}
                >
                    NEW GAME
                </h2>
            </div>
            <div className="menu-option arcade-font">
                <h2
                    className="toogle-fade"
                    onClick={handleClickInstr}
                    onMouseEnter={handleHover}
                >
                    INSTRUCTIONS
                </h2>
            </div>
            <div className="menu-option arcade-font">
                <h2
                    className="toogle-fade"
                    onClick={handleClickHowMade}
                    onMouseEnter={handleHover}
                >
                    BEHIND THE SCENES
                </h2>
            </div>
            {/* If instructions is clicked, show instructions */}
            {instrClicked && <Instructions />}
            {/* If instructions is clicked, show instructions */}
            {howMadeClicked && <HowMade />}
        </div>
    );
}
