import { Connection } from "./connection";
import { Config } from "./config";
import { Game } from "./game";

const connection: Connection = new Connection(Config.server); //Establece la conexión con el servidor WebSocket.

//Inicializa el juego
new Game(connection);