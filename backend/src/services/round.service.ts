import { DBInterface } from 'dbSrc/db.service';
import Round from 'models/rounds';

export class RoundService {
	private static getRound = async (limit: number, offset = 0, state?: number) => {
		let conditions = { "gameId": +process.env.GAME_ID!, };

		if (state) {
			Object.assign(conditions, { state });
		}

		const round = await DBInterface.all(Round, {
			sort: [['id', 'DESC']],
			conditions: conditions,
			limit,
			offset,
		});
		return round;
	};

	private static getMaxCoefficientRound = async () => {
		const rounds = await DBInterface.all(Round, {
			sort: [['coeficient', 'DESC']],
			limit: 20,
		});

		return rounds;
	};

	public static getRounds = async () => {
		const rounds = (await this.getRound(40, 0, 3)).map((round) => {
			return round?.coeficient;
		});
		return rounds;
	};

	static lastRound = async () => {
		const round = await this.getRound(2);
		return round[1];
	};

	static nextRound = async () => {
		const round = await this.getRound(1);
		return round[0];
	};

	public static getMaxCoefficientesRound = async () => {
		const rounds = await this.getMaxCoefficientRound();
		return rounds
	};
}
