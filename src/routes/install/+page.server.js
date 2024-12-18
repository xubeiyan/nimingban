import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';

export const load = () => {
	return {
		db: {
			host: PGHOST,
			user: PGUSER,
			database: PGDATABASE,
			password: PGPASSWORD,
			port: PGPORT
		}
	};
};
