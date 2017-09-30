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
