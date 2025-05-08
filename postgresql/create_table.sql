-- Table: public.board

-- DROP TABLE IF EXISTS public.board;

CREATE TABLE IF NOT EXISTS public.board
(
    id uuid NOT NULL,
    parent_section_id uuid NOT NULL,
    min_post_second integer NOT NULL DEFAULT 10,
    min_post_timestamp timestamp without time zone NOT NULL,
    access_type character varying(16) NOT NULL DEFAULT 'all'::character varying,
    name character varying(256) NOT NULL,
    url_name character varying(256) NOT NULL,
    intro text,
    "order" integer,
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
    belong_post_id uuid NOT NULL,
    poster_name character varying(256),
    poster_email character varying(256),
    title character varying(256),
    content text,
    poster_cookies_id uuid,
    post_timestamp timestamp without time zone NOT NULL,
    edit_timestamp timestamp without time zone,
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
    create_timestamp timestamp without time zone NOT NULL,
    expire_timestamp timestamp without time zone NOT NULL,
    content character varying(32),
    status character varying(16),
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
    poster_name character varying(256) COLLATE ,
    poster_email character varying(256) COLLATE ,
    title character varying(256) COLLATE ,
    content text COLLATE ,
    poster_cookies_id uuid NOT NULL,
    post_timestamp timestamp without time zone NOT NULL,
    edit_timestamp timestamp without time zone,
    belong_board_id uuid NOT NULL,
    status character varying(16) COLLATE ,
    last_reply_timestamp timestamp without time zone NOT NULL,
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
    image_type character varying(16) NOT NULL,
    exist_type character varying(16) NOT NULL,
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
    section_name character varying(256) NOT NULL,
    "order" integer,
    CONSTRAINT section_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.section
    OWNER to nimingban_user;


-- Table: public.site_settings

-- DROP TABLE IF EXISTS public.site_settings;

CREATE TABLE IF NOT EXISTS public.site_settings
(
    name character varying(64) NOT NULL,
    data_type character varying(64) NOT NULL,
    value character varying(128) NOT NULL,
    description character varying(256) NOT NULL,
    CONSTRAINT site_settings_pkey PRIMARY KEY (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.site_settings
    OWNER to nimingban_user;

-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    id uuid NOT NULL,
    status character varying(16),
    username character varying(256),
    password_hash character varying(128),
    password_salt character varying(128),
    type character varying(16),
    create_timestamp timestamp without time zone,
    reset_password character varying(128),
    CONSTRAINT user_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to nimingban_user;