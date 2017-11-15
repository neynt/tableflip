#!/bin/sh

set -e

abort() {
    echo "status_active aborted: $@"
    exit 1
}

log() {
    echo "$(date --iso-8601=seconds) status_active: $@" >> /var/log/ghettosync/ghettosync.log
}

STATUS_FILE="ghettosync_status"
ROLE_FILE="ghettosync_role"

STATUS_PATH="/var/www/html/$STATUS_FILE"
ROLE_PATH="/var/www/html/$ROLE_FILE"

log "status_active starting."

echo "ACTIVE" > $STATUS_PATH

log "status_active completed."