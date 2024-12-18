import { json } from '@sveltejs/kit';
import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { connectToDB } from '$lib/db';

export const GET = async () => {
	const dbconn = await connectToDB({
		host: PGHOST,
		user: PGUSER,
		pass: PGPASSWORD,
		port: PGPORT,
		database: PGDATABASE
	});

	await dbconn.query(`
        CREATE TABLE IF NOT EXISTS public.board
        (
            id uuid NOT NULL,
            parent_section_id uuid NOT NULL,
            min_post_second integer NOT NULL DEFAULT 10,
            min_post_timestamp timestamp without time zone NOT NULL,
            access_type character varying(16) COLLATE pg_catalog."default" NOT NULL DEFAULT 'all'::character varying,
            name character varying(256) COLLATE pg_catalog."default" NOT NULL,
            url_name character varying(256) COLLATE pg_catalog."default" NOT NULL,
            intro text COLLATE pg_catalog."default",
            "order" integer,
            CONSTRAINT board_pkey PRIMARY KEY (id)
        ) TABLESPACE pg_default;
    `);

	return json({
		type: 'ok'
	});
};
