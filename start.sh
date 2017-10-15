#!/bin/bash
export FLASK_APP="api/__init__.py"
export DATABASE_URL="postgresql://localhost/tableflip"
PG_LOG="postgres.log"
[[ -f .env ]] && export $(cat .env | xargs)

if [ "$(uname)" != "Linux" ]; then
    # Start Postgres if your OS doesn't handle that for you
    if pg_ctl status -D "$PG_DIR" ; then
        echo "[postgres already running]"
    else
        echo "Starting postgres..."
        pg_ctl start -D "$PG_DIR" -l "$PG_LOG"
        echo "  -> SUCCESS. logs in $PG_LOG"
    fi
fi

case "$1" in
"web")
    (cd web && npm run dev)
    ;;
"api")
    source venv/bin/activate
    exec flask run --with-threads -p ${FLASK_PORT:-5000}
    ;;
"shell")
    source venv/bin/activate
    flask shell
    ;;
"engine")
    exec node engine/index.js
    ;;
"psql")
    psql -h utena.neynt.ca -U tableflip_staging tableflip_staging
    ;;
*)
    echo "Usage: ./start.sh [all|web|api|shell|engine|psql]"
esac
