/**
 * @license
 * Pong is a HTML5 game.
 * Copyright (C) 2020 R. V., Diego <diego_pkv@hotmail.com>
 *
 * Pong is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pong is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as $ from "jquery";
import { Ball } from "./ball";
import { Config } from "./config";
import { Connection } from "./connection";
import { KeyboardInputController } from "./input";
import { Player } from "./player";
import { Score } from "./score";

/**
 * Es el area en el que las partidas tienen lugar.
 * Aquí se encuentra el canvas en el que se dibuja y se guarda todo el estado de la partida.
 * @export
 * @class Game
 */
export class Game {
	public started: boolean;
	public resizing: NodeJS.Timeout;	// Temporizador para redimensionar el juego
	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;
	public connection: Connection;
	public firstPlayer: Player;
	public secondPlayer: Player;
	public ball: Ball;
	public score: Score;
	public inputController: KeyboardInputController;
	public matchId: string;

	/**
	 * Crea el juego.
	 * @memberof Game
	 */
	constructor(connection: Connection) {
		this.connection = connection;
		this.canvas = document.createElement("canvas");
		this.firstPlayer = new Player(this, "rgb(30,142,217)", 30, Config.gameHeight / 2 - 40);
		this.secondPlayer = new Player(this,"rgb(230, 60, 60)" , Config.gameWidth - 40, Config.gameHeight / 2 - 40);
		this.ball = new Ball(this, 10);
		this.score = new Score(this);
		this.connection.initialize(this);
		this.start();
	}

	/** Inicia el juego.
	 * @memberof Game
	 */
	public start(): void {
		this.canvas.width = Config.gameWidth;
		this.canvas.height = Config.gameHeight;
		this.context = this.canvas.getContext("2d");
		$("body").append(this.canvas);
		this.configListeners();
		setInterval(()=> {this.updateGameArea()}, 1);
	}

	/** Limpia el area de juego.
	 * @private
	 * @memberof Game
	 */
	private clear(): void {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * Restaura el estado por defecto.
	 * Restaura los objetos a las propiedades por defecto e inicia una nueva partida.
	 * @memberof Game
	 */
	public reset(): void {
		this.canvas.style.cursor = "none";
		this.firstPlayer.y = Config.gameHeight / 2 - (this.firstPlayer.height / 2);
		this.secondPlayer.y = Config.gameHeight / 2 - (this.secondPlayer.height / 2);
		this.ball.x = Config.gameWidth / 2;
		this.ball.y = Config.gameHeight / 2;

		// Inicia la partida lanzando la bola a uno de los dos jugadores de forma aleatoria tras medio segundo
		setTimeout(() => {
			const Yspeed: number = Math.random() * 2;

			if (Math.random() > 0.45) {
				this.ball.speedY = Yspeed;
			} else {
				this.ball.speedY = Yspeed * -1;
			}

			if (Math.random() > 0.45) {
				this.ball.speedX = 2;
			} else {
				this.ball.speedX = -2;
			}
		}, 500);
	}

	// TODO Cambiarlo por redimensión en tiempo real, sin pausar la partida.
	/**
	 * Redimensiona el area de juego.
	 * Detiene el juego, lo redimensiona para que ocupe todo el tamaño del area de trabajo del navegador
	 * y restaura las propiedades por defecto de los objetos.
	 * @private
	 * @memberof Game
	 */
	private resize(): void {
		this.started = false;
		this.ball.speedX = 0;
		this.ball.speedY = 0;

		this.canvas.width = Config.gameWidth;
		this.canvas.height = Config.gameHeight;

		this.firstPlayer.y = Config.gameHeight / 2 - (this.firstPlayer.height / 2);
		this.secondPlayer.y = Config.gameHeight / 2 - (this.secondPlayer.height / 2);
		this.secondPlayer.x = Config.gameWidth - 40;
		this.ball.x = Config.gameWidth / 2;
		this.ball.y = Config.gameHeight / 2;
	}

	/**
	 * Configura los event listeners.
	 * Establece la configuración de la redimensión y las entradas del teclado.
	 * @private
	 * @memberof Game
	 */
	private configListeners(): void {
		this.inputController = new KeyboardInputController(this); // Configura los inputs de teclado.

		// Configura el event listener para que el juego redimensione cuando la ventana del navegador haga lo mismo.
		$(window).on("resize", () => {
			// Esconde el juego durante la redimensión
			if (!$(this.canvas).is(":hidden")) {
				$(this.canvas).hide(300);
			}

			// Detiene el temporizador mientras se siga redimensionando
			clearTimeout(this.resizing);

			// Tras 300 ms se redimensiona el juego al tamaño de la ventana y entonces se muestra
			this.resizing = setTimeout((): void => {
				this.resize();
				$(this.canvas).show(300);
			}, 300);
		});
	}

	/**
	 * Actualiza el area de juego.
	 * Redibuja todos los objetos tras limpiar la pantalla. Esta función representa un frame.
	 * @private
	 * @memberof Game
	 */
	private updateGameArea(): void {
		this.clear();
		this.firstPlayer.newPos();
		this.secondPlayer.newPos();
		this.ball.newPos();
		this.firstPlayer.update();
		this.secondPlayer.update();
		this.ball.update();
		this.score.update();
	}
}
