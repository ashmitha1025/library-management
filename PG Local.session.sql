CREATE DATABASE librarydb;
\c librarydb

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100),
  password VARCHAR(100)
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  author VARCHAR(100)
);

CREATE TABLE issued (
  id SERIAL PRIMARY KEY,
  student VARCHAR(100),
  book VARCHAR(100)
);

