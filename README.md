# tableflip

play board games with me

## Overview of top level directories

- `web/`: Vue.js web frontend. Talks with `api/`.
- `api/`: Python/Flask REST API. Talks with `engine/`.
- `engine/`: Node.js server-side game logic engine.
- `games/`: Game modules.

## How to run everything

Install OS dependencies: Python 3 and Node.js.

Create `.env` as appropriate.

Install npm/pip dependencies:

```bash
./setup.sh
```

Finally, run everything using `./start.sh`:

```
./start.sh engine
./start.sh api
./start.sh web
```

### Using local PostgreSQL

For development without internet access, it can be useful to have `api/` talk
to a local PostgreSQL instance.

Install PostgreSQL if you have not:

```
# Mac:
brew install postgresql
# Ubuntu:
apt install postgresql
systemctl enable postgresql
systemctl start postgresql
```

Set up the database as follows:

```
sudo su postgres
psql
create database tableflip;
create user ${YOUR_USERNAME};

# (Possibly optional)
grant all privileges on database tableflip to ${YOUR_USERNAME};
```

Create the tables and populate them with sample data:

```
./start.sh shell
from api import models
models.init_db()
models.sample_data()
```

Replace the `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://localhost/tableflip"
```

`./start.sh api` should now talk to the local Postgres.

## Games

One of Tableflip's most impressive features is its extensible architecture for creating new games. A game is defined as a set of three data structures:

- `game_state`: All the information in the game.
- `game_view`: The information that a particular player can see in the game.
- `action`: A description of an action taken by a player.

And eight mostly-pure functions:

- `initial_state(num_players): game_state`
  - Creates an initial game state for `p` players.
- `player_view(game_state, player_id): game_view`
  - Gets of a view of the game state for a given player.
- `current_players(game_state): [player_id]`
  - Gets the list of players who may make actions at the current time.
- `has_legal_action(game_view): bool`
  - Determines whether a player with the given `game_view` can make any actions.
- `is_action_legal(game_view, action): bool`
  - Determines whether the given `action` is legal with player's the given `game_view`.
- `perform_action(game_state, player_id, action): game_state`
  - Applies an action to a game state to produce a new game state.
- `is_game_finished(game_state): boolean`
  - Determines whether the game is finished.
- `winners(game_state): [player_id]`
  - Determines a list of winners for the game.
