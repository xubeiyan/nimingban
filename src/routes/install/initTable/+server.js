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

	try {
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

        CREATE TABLE IF NOT EXISTS public.comment
        (
            id uuid NOT NULL,
            belong_post_id uuid NOT NULL,
            poster_name character varying(256),
            poster_email character varying(256),
            title character varying(256),
            content text,
            poster_cookies_id uuid,
            post_timestamp timestamp without time zone NOT NULL,
            edit_timestamp timestamp without time zone,
            CONSTRAINT comment_pkey PRIMARY KEY (id)
        ) TABLESPACE pg_default;

        CREATE TABLE IF NOT EXISTS public.cookies
        (
            id uuid NOT NULL,
            belong_user_id uuid NOT NULL,
            create_timestamp timestamp without time zone NOT NULL,
            expire_timestamp timestamp without time zone NOT NULL,
            content character varying(32),
            status character varying(16),
            CONSTRAINT cookies_pkey PRIMARY KEY (id)
        ) TABLESPACE pg_default;

        CREATE TABLE IF NOT EXISTS public.post
        (
            id uuid NOT NULL,
            poster_name character varying(256),
            poster_email character varying(256),
            title character varying(256),
            content text,
            poster_cookies_id uuid NOT NULL,
            post_timestamp timestamp without time zone NOT NULL,
            edit_timestamp timestamp without time zone,
            belong_board_id uuid NOT NULL,
            status character varying(16),
            CONSTRAINT post_pkey PRIMARY KEY (id)
        ) TABLESPACE pg_default;

        CREATE TABLE IF NOT EXISTS public.post_comment_image
        (
            id uuid NOT NULL,
            image_type character varying(16) NOT NULL,
            exist_type character varying(16) NOT NULL,
            post_id uuid,
            CONSTRAINT post_comment_image_pkey PRIMARY KEY (id)
        ) TABLESPACE pg_default;

        CREATE TABLE IF NOT EXISTS public.section
        (
            id uuid NOT NULL,
            section_name character varying(256) NOT NULL,
            "order" integer,
            CONSTRAINT section_pkey PRIMARY KEY (id)
        ) TABLESPACE pg_default;

        CREATE TABLE IF NOT EXISTS public.site_settings
        (
            name character varying(64) NOT NULL,
            data_type character varying(64) NOT NULL,
            value character varying(128) NOT NULL,
            description character varying(256) NOT NULL,
            CONSTRAINT site_settings_pkey PRIMARY KEY (name)
        ) TABLESPACE pg_default;

        CREATE TABLE IF NOT EXISTS public."user"
        (
            id uuid NOT NULL,
            status character varying(16),
            username character varying(256),
            password_hash character varying(128),
            password_salt character varying(128),
            type character varying(16),
            create_timestamp timestamp without time zone,
            CONSTRAINT user_pkey PRIMARY KEY (id)
        ) TABLESPACE pg_default;
    `);
	} catch (e) {
		return json({
			type: 'error',
			errorContent: e
		});
	}

	return json({
		type: 'ok'
	});
};
