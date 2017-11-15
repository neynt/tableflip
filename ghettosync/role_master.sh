#!/bin/sh

set -e

abort() {
    echo "status_standby aborted: $@"
    exit 1
}

log() {
    echo "$(date --iso-8601=seconds) role_master: $@" >> /var/log/ghettosync/ghettosync.log
}

ROLE_FILE="ghettosync_role"
ROLE_PATH="/var/www/html/$ROLE_FILE"

TRIGGER_FILE="/tmp/postgresql.trigger.5432"

log "role_master generating trigger file."

echo "VIVE LE SQL LIBRE!" > $TRIGGER_FILE

log "Updating role..."
echo "MASTER" > $ROLE_PATH

log "role_master completed."