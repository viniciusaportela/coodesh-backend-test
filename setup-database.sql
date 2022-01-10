CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    featured BOOLEAN NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    news_site TEXT NOT NULL,
    summary TEXT NOT NULL,
    published_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(150) NOT NULL
);

CREATE TABLE article_event (
    article_id SERIAL REFERENCES articles (id) ON UPDATE CASCADE ON DELETE CASCADE,
    event_id SERIAL REFERENCES events (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT article_event_pk PRIMARY KEY (article_id, event_id)
);

CREATE TABLE launches (
    id UUID DEFAULT uuid_generate_v4 (),
    provider VARCHAR(150) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE article_launch (
    article_id SERIAL REFERENCES articles (id) ON UPDATE CASCADE ON DELETE CASCADE,
    launch_id UUID REFERENCES launches (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT article_launch_pk PRIMARY KEY (article_id, launch_id)
);