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
 * Representa la pelota de ping pong.
 * Representa una pelota que rebotará en los límites superior e inferior de la pantalla y en las raquetas de los jugadores.
 * Si alcanza los límites laterales se contabilizará un punto para el jugador del lado contrario.
 * @export
 * @class Ball
 */
export class Ball {
	private gameArea: Game;
	private context: CanvasRenderingContext2D;
    private radius: number;
	public speedX: number;
	public speedY: number;
	public x: number;
    public y: number;

	/**
	 * Crea una pelota.
	 * @param {Game} gameArea - El area del juego en el que se representará la pelota.
 	 * @param {number} radius - Tamaño del radio de la pelota (píxeles).
	 * @memberof Ball
	 */
	public constructor (gameArea: Game, radius: number) {
		this.gameArea = gameArea;
		this.context = gameArea.context;
        this.radius = radius;
        this.speedX = 0;
        this.speedY = 0;
        this.x = Config.gameWidth / 2;
    }

	/**
	 * Dibuja el objeto.
	 * @memberof Ball
	 */
	public update(): void {
		this.refreshContext();
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		this.context.fillStyle = "black";
		this.context.fill();
		this.context.closePath();
	}

	/**
	 * Calcula la próxima posición.
	 * Calcula la posición que ocupará la pelota la próxima vez que se dibuje de nuevo, teniendo en cuenta las colisiones.
	 * @memberof Ball
	 */
	public newPos(): void {
		const firstPlayer: Player = this.gameArea.firstPlayer;
		const secondPlayer: Player = this.gameArea.secondPlayer;
		const MAX_Y_SPEED: number = 2;
		const MAX_X_SPEED: number = 9;
		const x_limit: number = this.gameArea.canvas.width - this.radius;
		const y_limit: number = this.gameArea.canvas.height - this.radius;

		//Asegura un rebote vertical negativo (hacia arriba)
		const reboteNegativo = (newValue: number) => {
			this.speedY = 0;
			this.speedY = this.speedY - newValue > MAX_Y_SPEED * -1 ? this.speedY - newValue : this.speedY - Math.random() * 2;
		}

		//Asegura un rebote vertical positivo (hacia abajo)
		const rebotePositivo = (newValue: number) => {
			this.speedY = 0;
			this.speedY = this.speedY + newValue < MAX_Y_SPEED ? this.speedY + newValue : this.speedY + Math.random() * 2;
		}


		//Invierte el sentido de la bola al ser tocada por un jugador en el borde frontal
		if ((this.x - this.radius <= firstPlayer.x + firstPlayer.width && this.x + this.radius >= firstPlayer.x &&
			this.y + this.radius >= firstPlayer.y && this.y <= firstPlayer.y + firstPlayer.height) ||
			(this.x + this.radius >= secondPlayer.x && this.x - this.radius <= secondPlayer.x + secondPlayer.width &&
				this.y + this.radius >= secondPlayer.y && this.y <= secondPlayer.y + secondPlayer.height)) {
			this.speedX = -this.speedX;


			let newValue: number = Math.random() * 3;

			//Borde superior del primer jugador
			if (this.x - this.radius >= firstPlayer.x && this.x - this.radius <= firstPlayer.x + firstPlayer.width &&
				this.y + this.radius >= firstPlayer.y && this.y + this.radius <= firstPlayer.y + this.radius / 2) {
				this.y = firstPlayer.y - this.radius * 2;
				reboteNegativo(newValue);

				//Borde inferior del primer jugador
			} else if (this.x - this.radius >= firstPlayer.x && this.x - this.radius <= firstPlayer.x + firstPlayer.width &&
				this.y - this.radius >= firstPlayer.y + firstPlayer.height && this.y + this.radius >= firstPlayer.y + firstPlayer.height) {
				this.y = firstPlayer.y + firstPlayer.height + this.radius * 2;
				rebotePositivo(newValue);

				//Borde superior del segundo jugador
			} else if (this.x + this.radius <= secondPlayer.x + secondPlayer.width && this.x + this.radius >= secondPlayer.x &&
				this.y + this.radius >= secondPlayer.y && this.y + this.radius <= secondPlayer.y + this.radius / 2) {
				this.y = secondPlayer.y - this.radius * 2;
				reboteNegativo(newValue);

				//Borde inferior del segundo jugador
			} else if (this.x + this.radius <= secondPlayer.x + secondPlayer.width && this.x + this.radius >= secondPlayer.x &&
				this.y - this.radius >= secondPlayer.y + secondPlayer.height && this.y + this.radius >= secondPlayer.y + secondPlayer.height) {
				this.y = secondPlayer.y + secondPlayer.height + this.radius * 2;
				rebotePositivo(newValue);

			} else {
				//Fuerza la posición de la bola delante del jugador para evitar errores
				if ((this.x - this.radius <= firstPlayer.x + firstPlayer.width && this.x + this.radius >= firstPlayer.x &&
					this.y + this.radius >= firstPlayer.y && this.y - this.radius <= firstPlayer.y + firstPlayer.height))
					this.x = firstPlayer.x + firstPlayer.width + this.radius;
				else
					this.x = secondPlayer.x - this.radius;

				//Calcula una nueva trayectoria vertical aleatoria
				if (Math.random() > 0.45)
					this.speedY = this.speedY + newValue < MAX_Y_SPEED ? this.speedY + newValue : this.speedY - newValue;
				else
					this.speedY = this.speedY - newValue > MAX_Y_SPEED * -1 ? this.speedY - newValue : this.speedY + newValue;
			}

		}

		//Detiene la bola al tocar cualquiera de los límites laterales de la pantalla
		if (this.x < this.radius || this.x > x_limit) {
			this.speedX = 0;
			this.speedY = 0;

			if (this.x <= this.radius) {
				this.x = this.radius;
				secondPlayer.score++;
			} else if (this.x >= x_limit) {
				this.x = x_limit;
				firstPlayer.score++;
			}
			this.gameArea.canvas.style.cursor = "default";
			this.gameArea.started = false;
		} else {
			this.speedX *= this.speedX < MAX_X_SPEED ? 1 + Config.difficulty / 10000 : 1;
			this.x += this.speedX;
		}

		//Invierte el sentido de la bola al tocar los bordes superior/inferior de la pantalla
		if (this.y <= this.radius) {
			this.y = this.radius;
			this.speedY = -this.speedY;
		} else if (this.y >= y_limit) {
			this.y = y_limit - this.radius;
			this.speedY = -this.speedY;
		}

		this.y += this.speedY;
	}

	/**
	 * Refresca el contexto en el que se dibuja.
	 * @private
	 * @memberof Ball
	 */
	private refreshContext() {
		this.context = this.gameArea.context;
	}
}