#!/bin/sh

set -e

abort() {
    echo "status_standby aborted: $@"
    exit 1
}

log() {
    echo "$(date --iso-8601=seconds) status_standby: $@" >> /var/log/ghettosync/ghettosync.log
}

STATUS_FILE="ghettosync_status"
ROLE_FILE="ghettosync_role"

STATUS_PATH="/var/www/html/$STATUS_FILE"
ROLE_PATH="/var/www/html/$ROLE_FILE"

log "status_standby starting."

echo "STANDBY" > $STATUS_PATH

log "status_standby completed."