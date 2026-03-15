import { io } from '../socket';
import { SEND_ACTIONS } from '../constants/enums';
import { ERROR_TYPES, notFoundMessages } from '../constants/errortypes';

export class ErrorSender {
	public static sendError = async (
		errorCode: ERROR_TYPES,
		id?: string,
		errorMessages?: string | string[],
	) => {
		(id ? io.to(id) : io).emit(SEND_ACTIONS.Error, {
			code: errorCode,
			messages: errorMessages ?? notFoundMessages[errorCode] ?? 'Unknown error.',
		});
	};
}
