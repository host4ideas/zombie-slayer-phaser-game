import React from "react";

export default function Instructions() {
	return (
		<div className="instructions">
			<div>
				<h3><i className="far fa-keyboard"></i> CONTROLS <i className="far fa-keyboard"></i></h3>
				<p>Movimiento: W (arriba) A (izquierda) S (abajo) D (derecha)</p>
				<p>Disparo y recarga: Btn. izq. mouse (disparo) R (recarga)</p>
				<p>Cambio de armas: 1 (linterna) 2 (cuchillo de combate) 3 (FN 5.7) 4 (AK-47) 4 (SPAS-12)</p>
			</div>
			<div>
				<h3><i className="fab fa-leanpub"></i> HOW TO PLAY <i className="fab fa-leanpub"></i></h3>
				<p>El juego funciona con un sistema de rondas, cuantas más rondas más zombies habrá en la partida.
					Se comienza con 5 puntos de vida. Todos los enemigos cuentan con 3 puntos de vida, la velocidad
					con la que serás capaz de acabar con ellos dependerá del arma que escojas.
				</p>
			</div>
		</div>
	)
}