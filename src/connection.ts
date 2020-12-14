/**
 * Copyright (C) 2020 R. V., Diego <diego_pkv@hotmail.com>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license GPL-3.0
 */

import { Game } from './game';

/**
 *
 *
 * @export
 * @enum {number}
 */
export const enum StatusCodes {
    WAITING,
    MATCH_START,
    PLAYING,
    MATCH_END,
    CLOSE
}
/**
 * Formato estándar para la comunicación con el servidor.
 * @interface serverMessage
 */
interface serverMessage {
    status: StatusCodes;
    params?: {
        matchId?: string
    };
}

/**
 * Establece la conexión con el servidor.
 * Permite la comunicación entre cliente y servidor.
 * @export
 * @class Connection
 */
export class Connection {
    private gameArea: Game;
    private server: string;
    private port: string;
    private connection: WebSocket;

    /**
     * Instancia la conexión con el servidor.
     * @param {string} server
     * @param {string} [port="8080"]
     * @memberof Connection
     */
    constructor(server: string, port: string = "8080") {
        this.server = server;
        this.port = port;
        this.connection = new WebSocket("ws://" + this.server + ":" + this.port);
        this.connection.onmessage = (ev: MessageEvent): void => {
            this.analyzeData(JSON.parse(ev.data));
        };

        this.connection.onerror = (ev) => {
            console.error(ev);
        };
    }

    /**
     * Cambia el estado de la conexión.
     * Envía un mensaje al servidor indicando el estado en el que se encuentra el cliente.
     * @param {number} status - El código del estado de la partida.
     * @param {{}} [params] - Parámetros extra que enviar al servidor mientras la partida está en curso.
     * @memberof Connection
     */
    public send(status: number, params?: {}): void {
        if ([
            StatusCodes.WAITING,
            StatusCodes.MATCH_START,
            StatusCodes.PLAYING,
            StatusCodes.MATCH_END,
            StatusCodes.CLOSE
        ].includes(status)) {
            let body: { status: number, params?: {} } = {status};

            if (params) {
                body = {
                    status: status,
                    params: params
                };
            }

            this.connection.send(JSON.stringify(body));
        }
    }

    /**
     * Retorna el estado de la conexión WebSocket.
     * @returns {number}
     * @memberof Connection
     */
    public getStatus(): number {
        return this.connection.readyState;
    }

    public initialize(gameArea: Game): void {
        this.gameArea = gameArea;
    }

    /**
     * Analiza los datos recibidos del servidor.
     * @private
     * @param {serverMessage} data - Los datos del servidor en formato JSON.
     * @memberof Connection
     */
    private analyzeData(data: serverMessage): void {
        switch(data.status) {
            case StatusCodes.WAITING:
                
            case StatusCodes.MATCH_START:
                this.gameArea.matchId =  data.params.matchId;
                this.gameArea.start();
        }

    }
}
