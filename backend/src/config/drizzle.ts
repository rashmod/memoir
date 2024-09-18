import { defineConfig } from 'drizzle-kit';

import envConfig from './env';

export default defineConfig({
	schema: './src/db/schema/index.ts',
	out: './src/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: envConfig.DB_URL,
	},
	verbose: true,
	strict: true,
});
