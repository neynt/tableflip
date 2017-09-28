#!/bin/sh
APP=api/__init__.py
PG_LOG=postgres.log

DATABASE_URL_STR="postgresql://localhost/tableflip"

if pg_ctl status -D "$PG_DIR" ; then
    echo "[postgres already running]"
else
    echo "Starting postgres..."
    pg_ctl start -D "$PG_DIR" -l "$PG_LOG"
    echo "  -> SUCCESS. logs in $PG_LOG"
fi

[[ -z "$FLASK_APP"  ]] && export FLASK_APP="$APP"
[[ -z "$DATABASE_URL"  ]] && export DATABASE_URL="$DATABASE_URL_STR"
flask run
