/**
 * Copyright (C) 2020 R. V., Diego <diego_pkv@hotmail.com>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license GPL-3.0
 */

import { Game } from "./game";

/**
 * Representa al jugador.
 * La instancia de este objeto representa una raqueta de ping pong que será controlada por el jugador.
 * @export
 * @class Player
 */
export class Player {
	private gameArea: Game;
	private context: CanvasRenderingContext2D;
	private id: number;
    private color: string;
	public width: number;
	public height: number;
	public score: number;
	public speedY: number;
	public x: number;
	public y: number;
	
	/**
	* Crea un jugador.
	* @param {Game} gameArea - El area del juego en el que se representará el objeto.
	* @param {string} color - El color con el que se pintará el objeto, el formato debe ser interpretable por el navegador.
	* @param {number} x - La posición horizontal desde la que se empieza a pintar la raqueta.
	* @param {number} y - La posición vertical desde la que se empieza a pintar la raqueta.
	* @memberof Player
	*/
	public constructor(gameArea: Game, color: string, x: number, y: number) {
		this.gameArea = gameArea;
        this.color = color;
        this.width = 10;
        this.height = 100;
        this.score = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
    }

	/**
	 * Dibuja el objeto.
	 * @memberof Player
	 */
	public update(): void {
		this.refreshContext();
		this.context.fillStyle = this.color;
		this.context.fillRect(this.x, this.y, this.width, this.height);
	}

	/**
	 * Calcula una nueva posición.
	 * Calcula la nueva posición del objeto teniendo en cuenta los límites del area.
	 * Si excede algún límite se fija la posición al límite del area.
	 * @memberof Player
	 */
	public newPos(): void {
		const y_limit: number = this.gameArea.canvas.height - this.height;

		if (this.gameArea.started) {
			if (this.y < 0 || this.y > y_limit) {
				this.speedY = 0;

				if (this.y < 0) {
					this.y = 0;
				} else if (this.y > y_limit) {
					this.y = y_limit;
				}
			} else {
				this.y += this.speedY;
			}
		}
	}

	/**
	 * Retorna el ID asignado por el servidor para identificar al jugador.
	 * @memberof Player
	 */
	public getId() {
		return this.id;
	}

	/**
	 * Asigna el parámetro id al jugador para que sea identificado por el servidor.
	 * @memberof Player
	 * @param {number} id - Es el identificador que será asignado.
	 */
	public setId(id: number) {
		this.id = id;
	}

	/**
	 * Refresca el contexto en el que se dibuja.
	 * @private
	 * @memberof Player
	 */
	private refreshContext(): void {
		this.context = this.gameArea.context;
	}
}
