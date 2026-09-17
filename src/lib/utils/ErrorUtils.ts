import type { UiErrorEntity } from '../entities/error.entity';
import { UiError } from '../entities/uierror.entity';

export class ErrorUtils {
	static handleErrors(error: unknown): UiErrorEntity {
		if (error instanceof UiError) {
			return {
				type: error.type,
				title: error.message,
				message: ''
			};
		} else {
			return {
				type: 'error',
				title: 'An error happened, please try again.',
				message: ''
			};
		}
	}
}
