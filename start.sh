#!/bin/sh
APP=api/__init__.py
PG_LOG=postgres.log
DB_URL=postgresql://localhost/tableflip

if pg_ctl status -D "$PG_DIR" ; then
    echo "[postgres already running]"
else
    echo "Starting postgres..."
    pg_ctl start -D "$PG_DIR" -l "$PG_LOG"
    echo "  -> SUCCESS. logs in $PG_LOG"
fi

export FLASK_APP="$APP"
export DATABASE_URL="$DB_URL"
flask run
