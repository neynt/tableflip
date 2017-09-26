DROP TABLE users CASCADE;
CREATE TABLE users
(
  id        serial primary key,
  username  varchar(255),
  password  char(128) -- 512-bit hash represented as hex digits
--salt      char(64)  -- excluded for now
);

DROP TABLE lobbies CASCADE;
CREATE TABLE lobbies
(
  id        serial primary key
);

DROP TABLE users_lobbies;
CREATE TABLE users_lobbies
(
  user_id   int NOT NULL,
  lobby_id  int NOT NULL,
  PRIMARY KEY (user_id, lobby_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lobby_id) REFERENCES lobbies(id) ON DELETE CASCADE
);

DROP TABLE games CASCADE;
CREATE TABLE games
(
    id      serial primary key,
    state   json
);

DROP TABLE users_games;
CREATE TABLE users_games
(
  user_id   int NOT NULL,
  game_id   int NOT NULL,
  player_id int NOT NULL, -- player id within the game
  PRIMARY KEY (user_id, game_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
