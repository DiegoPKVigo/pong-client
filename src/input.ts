/**
 * Copyright (C) 2020 R. V., Diego <diego_pkv@hotmail.com>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license GPL-3.0
 */

import { Config } from "./config";
import { Connection, StatusCodes } from "./connection";
import { Game } from "./game";
import { Player } from "./player";

/**
 * Controla los eventos del teclado.
 * Es la interfaz que permite al jugador interactuar con el juego.
 * @export
 * @class KeyboardInputController
 */
export class KeyboardInputController {
    private keys: Map<string, boolean>;
    private connection: Connection;
    private gameArea: Game;
    private firstPlayer: Player;
    private secondPlayer: Player;

    constructor(gameArea: Game) {
        this.keys = new Map();
        this.gameArea = gameArea;
        this.connection = gameArea.connection;
        this.firstPlayer = gameArea.firstPlayer;
        this.secondPlayer = gameArea.secondPlayer;
        this.initializeInputListeners();
    }


    /**
     * Inicializa los event listeners.
     * Captura los eventos cada vez que se pulsan una o más teclas. 
     * @private
     * @memberof KeyboardInputController
     */
    private initializeInputListeners(): void {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this.keys.set(event.code, true);

            if (this.keys.get("ShiftLeft") && this.keys.get("KeyW")) {
                this.firstPlayer.speedY = -4;
            } else if (this.keys.get("KeyW")) {
                this.firstPlayer.speedY = -2;
            }

            if (this.keys.get("ShiftLeft") && this.keys.get("KeyS")) {
                this.firstPlayer.speedY = 4;
            } else if (this.keys.get("KeyS")) {
                this.firstPlayer.speedY = 2;
            }
        });
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this.keys.set(event.code, false);

            if (event.code === "ShiftLeft") {
                this.firstPlayer.speedY /= 2;
            }

            if (!this.keys.get("KeyW") && !this.keys.get("KeyS")) {
                this.firstPlayer.speedY = 0;
            }

            if (event.key === "Enter") {
                if (!this.gameArea.started && this.firstPlayer.score < Config.max_score && this.secondPlayer.score < Config.max_score) {
                    this.gameArea.reset();
                    this.connection.send(StatusCodes.WAITING);
                }
            }
        });
    }
}
