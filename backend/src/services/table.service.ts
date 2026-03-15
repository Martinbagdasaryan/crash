import { DBInterface } from 'dbSrc/db.service';
import Game from 'models/games';

export class TableService {
	private static getGame = async (gameId: string) => {
		const game = await DBInterface.get(Game, {
			conditions: { id: gameId },
		});
		return game;
	};

	public static game = async (gameId: string) => {
		const game = await this.getGame(gameId);
		return game;
	};
}
