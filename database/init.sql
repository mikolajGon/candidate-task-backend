CREATE TABLE guides
(
    id         SERIAL PRIMARY KEY,
    content_length int NOT NULL
);

CREATE TABLE contents
(
    id       SERIAL PRIMARY KEY,
    title    varchar NOT NULL,
    language varchar NOT NULL,
    guide_id int     NOT NULL
);

CREATE TABLE content_steps
(
    id         SERIAL PRIMARY KEY,
    title      varchar NOT NULL,
    content    varchar NOT NULL,
    step_order int     NOT NULL,
    content_id int     NOT NULL
);

ALTER TABLE contents
    ADD FOREIGN KEY (guide_id) REFERENCES guides (id);

ALTER TABLE content_steps
    ADD FOREIGN KEY (content_id) REFERENCES contents (id);
