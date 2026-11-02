import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_API_URL: {
		public: true
	},
	PUBLIC_READY: {
		public: true
	},
	// "true" once a print partner is signed; merch buttons stay hidden until then
	PUBLIC_MERCH_ENABLED: {
		public: true
	}
});
