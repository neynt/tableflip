
set -e

PGPASSWORD="stell4rated_dr3ams"
DATABASE_URL="postgresql://postgres:stell4rated_dr3ams@104.238.128.152/tableflip"

PGUSER="postgres"
PGPASSWORD="stell4rated_dr3ams"

DB1="104.238.128.152"
DB2="45.77.147.104"

CURL_TIMEOUT=20
PING_INTERVAL=5

ROLE_FILE="ghettosync_role"

TIMEOUT_CMD="${TIMEOUT_CMD:-timeout}"

while true
do
    DB1_ROLE="$($TIMEOUT_CMD ${CURL_TIMEOUT}s curl http://$DB1/$ROLE_FILE || echo "404")"
    DB2_ROLE="$($TIMEOUT_CMD ${CURL_TIMEOUT}s curl http://$DB2/$ROLE_FILE || echo "404")"

    if echo "$DB1_ROLE" | grep --silent "404"; then
        DB1_ROLE="404"
    fi
    if echo "$DB2_ROLE" | grep --silent "404"; then
        DB2_ROLE="404"
    fi

    if [ "$DB1_ROLE" = "404" ] && [ "$DB2_ROLE" = "404" ]; then
        exit 1
    fi

    if [ "$DB1_ROLE" = "$DB2_ROLE" ]; then
        sleep $PING_INTERVAL
        continue
    fi

    export PGPASSWORD="$PGPASSWORD"
    if [ "$DB1_ROLE" = "MASTER" ]; then
        export DATABASE_URL="postgresql://$PGUSER:$PGPASSWORD@$DB1/tableflip"
    elif [ "$DB2_ROLE" = "MASTER" ]; then
        export DATABASE_URL="postgresql://$PGUSER:$PGPASSWORD@$DB2/tableflip"
    fi

    break
done
