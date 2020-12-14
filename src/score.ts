/**
 * Copyright (C) 2020 R. V., Diego <diego_pkv@hotmail.com>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license GPL-3.0
 */

import { Config } from "./config";
import { Game } from "./game";
import { Player } from "./player";

/**
 * Representa el marcador.
 * Informa al usuario sobre la cantidad de puntos que tiene cada jugador y además indica como empezar a jugar
 * cuando no hay una partida en curso.
 * @export
 * @class Score
 */
export class Score {
	private gameArea: Game;
	private context: CanvasRenderingContext2D;
	private firstPlayer: Player;
	private secondPlayer: Player;

	/**
	* Crea la puntuación.
	* @param {Game} gameArea - La instancia del juego en la que se dibuja la puntuación.
	* @memberof Score
	*/
	constructor(gameArea: Game) {
		this.gameArea = gameArea;
		this.context = gameArea.context;
		this.firstPlayer = gameArea.firstPlayer;
		this.secondPlayer = gameArea.secondPlayer;
    }
	
	/**
	 * Dibuja el marcador en el area.
	 * @memberof Score
	 */
	public update(): void {
		this.refreshContext();
		this.context.textAlign = "center";

		if (this.firstPlayer.score === 0 && this.secondPlayer.score === 0 && !this.gameArea.started) {
			this.printHint(Config.gameWidth / 2, Config.gameHeight / 4);
		} else if (this.firstPlayer.score < Config.max_score && this.secondPlayer.score < Config.max_score) {
			this.context.font = "200px Arial";
			this.context.fillStyle = "rgba(0, 0, 0, 0.1)";
			this.context.fillText(this.firstPlayer.score + " - " + this.secondPlayer.score, Config.gameWidth / 2, Config.gameHeight / 4);
			if (!this.gameArea.started) {
				this.printHint(Config.gameWidth / 2, Config.gameHeight / 4 + 60);
			}
		} else if (this.firstPlayer.score === Config.max_score || this.secondPlayer.score === Config.max_score) {
			let winner: string;

			if (this.firstPlayer.score === Config.max_score) {
				winner = "1";
			} else {
				winner = "2";
			}
			this.context.font = "120px Arial";
			this.context.fillStyle = "rgb(0, 0, 0)";
			this.context.fillText("Player " + winner + " wins!", Config.gameWidth / 2, Config.gameHeight / 4);
		}
	}

	/**
	 * Dibuja la ayuda en el marcador.
	 * Cuando no hay una partida en curso muestra una ayuda que indica la tecla a pulsar para iniciar la partida.
	 * @param {number} posX - La posición horizontal en la que se mostrará el texto (píxeles).
	 * @param {number} posY - La posición vertical en la que se mostrará el texto (píxeles).
	 * @private
	 * @memberof Score
	 */
	private printHint(posX: number, posY: number): void {
		this.context.font = "60px Arial";
		this.context.fillStyle = "rgb(0, 0, 0)";
		this.context.fillText("Press Enter to start", posX, posY);
	}

	/**
	 * Refresca el contexto en el que se dibuja.
	 * @private
	 * @memberof Score
	 */
	private refreshContext() {
		this.context = this.gameArea.context;
	}
}