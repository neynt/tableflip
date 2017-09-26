# tableflip

play board games with me

## Overview of top level directories

- `api/`: REST API
- `engine/`: Node.js server-side game logic engine
- `games/`: Game modules
- `sql/`: Database schema and sample data
- `web/`: Vue.js web frontend

## Flask and DB Setup

```shell
pip install -r requirements.txt
export FLASK_APP=api/__init__.py
sql/create_db.sh
psql tableflip -a -f sql/create_tables.sql
psql tableflip -a -f sql/sample_data.sql
```

Flask server now can be run with `flask run`
