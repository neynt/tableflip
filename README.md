# tableflip

play board games with me

## Overview of top level directories

- `web/`: Vue.js web frontend
- `engine/`: Node.js server-side game logic engine
- `games/`: Game modules
- `api/`: REST API

## Flask and DB Setup

```
pip install -r requirements.txt
export FLASK_APP=api/__init__.py
sql/create_db.sh
psql tableflip -a -f sql/create_tables.sql
psql tableflip -a -f sql/sample_data.sql
```

Flask server now can be run with `flask run`
