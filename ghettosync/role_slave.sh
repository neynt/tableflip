#!/bin/sh

set -e

abort() {
    echo "status_standby aborted: $@"
    exit 1
}

log() {
    echo "$(date --iso-8601=seconds) role_slave: $@" >> /var/log/ghettosync/ghettosync.log
}

ROLE_FILE="ghettosync_role"
ROLE_PATH="/var/www/html/$ROLE_FILE"

TRIGGER_FILE="/tmp/postgresql.trigger.5432"

VAR_MAIN="/var/lib/postgresql/10/main"
ETC_MAIN="/etc/postgresql/10/main"

REPUSER_PASSWORD="postgres_ec0nomy"

PARTNER_IP="45.77.147.104"
PARTNER_IP_FULL="45.77.147.104/23"
log "role_slave starting..."

log "Shutting down postgres..."
service postgresql stop

log "Deleting trigger file, if it existed..."
rm -f $TRIGGER_FILE

log "Mothballing old database..."
rm -rf "${VAR_MAIN}.old"
mv "$VAR_MAIN" "${VAR_MAIN}.old" || true

log "Getting latest database from master..."
sudo -u postgres sshpass -p "$REPUSER_PASSWORD" pg_basebackup -h "$PARTNER_IP" -D "$VAR_MAIN" -U repuser -v -P -X stream

#log "Editing postgresql.conf..."
#sed -i '/hot_standby =/d' "$ETC_MAIN/postgresql.conf"
#echo "hot_standby = on" >> "$ETC_MAIN/postgresql.conf"

#sed -i '/wal_level =/d' "$ETC_MAIN/postgresql.conf"
#echo "wal_level = hot_standby" >> "$ETC_MAIN/postgresql.conf"

#sed -i '/archive_mode =/d' "$ETC_MAIN/postgresql.conf"
#echo "archive_mode = on" >> "$ETC_MAIN/postgresql.conf"

#sed -i '/archive_command =/d' "$ETC_MAIN/postgresql.conf"
#echo "archive_command = 'test ! -f mnt/server/archivedir/%f && cp %p mnt/server/archivedir/%f'" >> "$ETC_MAIN/postgresql.conf"

#sed -i '/max_wal_senders =/d' "$ETC_MAIN/postgresql.conf"
#echo "max_wal_senders = 3" >> "$ETC_MAIN/postgresql.conf"

#sed -i '/listen_addresses =/d' "$ETC_MAIN/postgresql.conf"
#echo "listen_addresses = '*'" >> "$ETC_MAIN/postgresql.conf"

log "Creating recovery.conf file..."
rm -f "$VAR_MAIN/recovery.done"
cp -avr /usr/share/postgresql/10/recovery.conf.sample "$VAR_MAIN/recovery.conf"
chown postgres:postgres "$VAR_MAIN/recovery.conf"

sed -i '/standby_mode/d' "$VAR_MAIN/recovery.conf"
echo "standby_mode = on" >> "$VAR_MAIN/recovery.conf"

sed -i '/primary_conninfo/d' "$VAR_MAIN/recovery.conf"
echo "primary_conninfo = 'host=$PARTNER_IP port=5432 user=repuser password=$REPUSER_PASSWORD'" >> "$VAR_MAIN/recovery.conf"

sed -i '/trigger_file/d' "$VAR_MAIN/recovery.conf"
echo "trigger_file = '$TRIGGER_FILE'" >> "$VAR_MAIN/recovery.conf"

log "Creating archivedir, if it doesn't already exist..."
mkdir -p "$VAR_MAIN/mnt/server/archivedir"
chown -R postgres:postgres "$VAR_MAIN/mnt"

#log "Allowing our partner to replicate from us..."
#echo "host replication repuser $PARTNER_IP_FULL md5" >> "$ETC_MAIN/pg_hba.conf"

service postgresql start

log "Updating role..."
echo "SLAVE" > $ROLE_PATH

log "role_slave completed."