-- 
SELECT s.id AS section_id, s.section_name AS section_name, b.id AS board_id, b.board_name AS board_name FROM public.section AS s LEFT JOIN public.board AS b ON s.id = b.parent_section_id;

-- Table: public.board

-- DROP TABLE IF EXISTS public.board;

CREATE TABLE IF NOT EXISTS public.board
(
    id uuid NOT NULL,
    parent_section_id uuid NOT NULL,
    min_post_second integer NOT NULL DEFAULT 10,
    min_post_timestamp timestamp with time zone NOT NULL,
    access_type character(16) COLLATE pg_catalog."default" NOT NULL DEFAULT 'all'::bpchar,
    name character varying(256) COLLATE pg_catalog."default" NOT NULL,
    url_name character varying(256) COLLATE pg_catalog."default" NOT NULL,
    intro text COLLATE pg_catalog."default",
    CONSTRAINT board_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.board
    OWNER to nimingban_user;

-- Table: public.comment

-- DROP TABLE IF EXISTS public.comment;

CREATE TABLE IF NOT EXISTS public.comment
(
    id uuid NOT NULL,
    belong_post uuid NOT NULL,
    poster_name character varying(256) COLLATE pg_catalog."default",
    poster_email character varying(256) COLLATE pg_catalog."default",
    title character varying(256) COLLATE pg_catalog."default",
    content text COLLATE pg_catalog."default",
    poster_cookies_id uuid,
    post_timestamp timestamp with time zone NOT NULL,
    edit_timestamp timestamp with time zone,
    CONSTRAINT comment_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.comment
    OWNER to nimingban_user;

-- Table: public.cookies

-- DROP TABLE IF EXISTS public.cookies;

CREATE TABLE IF NOT EXISTS public.cookies
(
    id uuid NOT NULL,
    belong_user_id uuid NOT NULL,
    create_timestamp timestamp with time zone NOT NULL,
    expire_timestamp timestamp with time zone NOT NULL,
    content character(32) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT cookies_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.cookies
    OWNER to nimingban_user;

-- Table: public.post

-- DROP TABLE IF EXISTS public.post;

CREATE TABLE IF NOT EXISTS public.post
(
    id uuid NOT NULL,
    poster_name character varying(256) COLLATE pg_catalog."default",
    poster_email character varying(256) COLLATE pg_catalog."default",
    title character varying(256) COLLATE pg_catalog."default",
    content text COLLATE pg_catalog."default",
    poster_cookies_id uuid NOT NULL,
    post_timestamp timestamp with time zone NOT NULL,
    edit_timestamp timestamp with time zone,
    CONSTRAINT post_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.post
    OWNER to nimingban_user;

-- Table: public.post_comment_image

-- DROP TABLE IF EXISTS public.post_comment_image;

CREATE TABLE IF NOT EXISTS public.post_comment_image
(
    id uuid NOT NULL,
    image_type character(16) COLLATE pg_catalog."default" NOT NULL,
    exist_type character(16) COLLATE pg_catalog."default" NOT NULL,
    post_id uuid,
    CONSTRAINT post_comment_image_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.post_comment_image
    OWNER to nimingban_user;

-- Table: public.section

-- DROP TABLE IF EXISTS public.section;

CREATE TABLE IF NOT EXISTS public.section
(
    id uuid NOT NULL,
    section_name character varying(256) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT section_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.section
    OWNER to nimingban_user;

-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    id uuid NOT NULL,
    status character(16) COLLATE pg_catalog."default" NOT NULL DEFAULT 'enable'::bpchar,
    username character varying(256) COLLATE pg_catalog."default" NOT NULL,
    password_hash character varying(128) COLLATE pg_catalog."default" NOT NULL,
    password_salt character varying(128) COLLATE pg_catalog."default" NOT NULL,
    type character(16) COLLATE pg_catalog."default" NOT NULL DEFAULT 'user'::bpchar,
    CONSTRAINT user_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to nimingban_user;