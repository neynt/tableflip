#!/bin/sh
export FLASK_APP="api/__init__.py"
export DATABASE_URL="postgresql://localhost/tableflip"
PG_LOG="postgres.log"

[[ -f .env ]] && export $(cat .env | xargs)

if [ "$(uname)" != "Linux" ]; then
    # Inferior OSes don't manage Postgres for you
    if pg_ctl status -D "$PG_DIR" ; then
        echo "[postgres already running]"
    else
        echo "Starting postgres..."
        pg_ctl start -D "$PG_DIR" -l "$PG_LOG"
        echo "  -> SUCCESS. logs in $PG_LOG"
    fi
fi

source venv/bin/activate
pip install -r requirements.txt

case "$2" in
    "shell")
        flask shell
        ;;
    *)
        flask run
        ;;
esac
