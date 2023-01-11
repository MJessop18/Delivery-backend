DROP DATABASE IF EXISTS bedcorndb;

CREATE DATABASE bedcorndb;

\c bedcorndb;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(15),
    last_name VARCHAR(20),
    role TEXT NOT NULL
);

CREATE TABLE user_preferences(
    id SERIAL PRIMARY KEY,
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE,
    favorite_artists TEXT,
    dark_mode BOOLEAN
);

CREATE TABLE albums(
    id SERIAL PRIMARY KEY,
    artist_names TEXT,
    album_title TEXT,
    album_length INTEGER,
    track_count INTEGER,
    album_cover TEXT
);

CREATE TABLE tracks(
    id SERIAL PRIMARY KEY,
    album_id INTEGER
        REFERENCES albums ON DELETE CASCADE,
    track_name TEXT,
    track_length INTEGER,
    genre TEXT,
    bpm INTEGER,
    tags TEXT,
    create_date INTEGER,
    album_cover TEXT
);

CREATE TABLE order_history(
    id SERIAL PRIMARY KEY,
    tracks_id INTEGER
        REFERENCES tracks,
    user_id INTEGER
        REFERENCES users,
    purchase_type TEXT,
    cost INTEGER,
    purchase_date INTEGER
);

INSERT INTO users
    (email, password, first_name, last_name, role)
VALUES 
    ('fake-email123@email.com', 'password', 'George', 'Smith', 'admin');

INSERT INTO users
    (email, password, first_name, last_name, role)
VALUES 
    ('coolemailname@email.com', 'password', 'John', 'Doe', 'client');

INSERT INTO users
    (email, password, first_name, last_name, role)
VALUES 
    ('realemailaddress@email.com', 'password', 'Mark', 'Zuckerberg', 'client');

INSERT INTO user_preferences
    (user_id, favorite_artists, dark_mode)
VALUES 
    (1, 'Playboi Carti, Comethazine, Trippieredd', True);

INSERT INTO user_preferences
    (user_id, favorite_artists, dark_mode)
VALUES 
    (2, 'Tears for Fears, Depeche Mode, David Hasselhoff', False);

INSERT INTO user_preferences
    (user_id, favorite_artists, dark_mode)
VALUES 
    (3, 'Eminem', True);

INSERT INTO albums
    (artist_names, album_title, album_length, track_count, album_cover)
VALUES 
    ('Bedcorn', '$omeThroaway$', 28.15, 8, 'gettyimages.com');

INSERT INTO albums
    (artist_names, album_title, album_length, track_count, album_cover)
VALUES 
    ('Bedcorn', 'Single', 3.01, 1, 'gettyimages.com');

INSERT INTO albums
    (artist_names, album_title, album_length, track_count, album_cover)
VALUES 
    ('Bedcorn', 'FT', 12.03, 5, 'gettyimages.com');