# tableflip

play board games with me

## Overview of top level directories

- `api/`: REST API
- `engine/`: Node.js server-side game logic engine
- `games/`: Game modules
- `sql/`: Database schema and sample data
- `web/`: Vue.js web frontend

## Flask and DB Setup

Install PostgreSQL if you have not:
brew/apt-get install postgresql

```shell
To start up flask app and install all requirements along with setting up
postgres
Run `./start.sh`
```

```Database
To create new database instance:
`python3 create_db.py`
To migrate database:
`python3 migrate_db.py`
To upgrade database version:
`python3 downgrade_db.py`
To downgrade database version:
`python3 downgrade_db.py`
```
