/**
 * Copyright (C) 2020 R. V., Diego <diego_pkv@hotmail.com>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license GPL-3.0
 */

/**
 * Configuración del juego.
 * @export
 */
export const Config = {
    server: "192.168.0.22",         // dirección en la que se localiza el servidor
    gameHeight: 720,                // altura del juego (se corresponde con la altura del área de trabajo del navegador)
    gameWidth: 1280,                // anchura del juego (se corresponde con la anchura del área de trabajo del navegador)
    difficulty: 1,                  // se utiliza para alterar la dificultad del juego aumentando la velocidad de forma exponencial
    max_score: 5	                // puntuación máxima (cuando uno de los dos jugadores la alcance se acaba el juego)
}