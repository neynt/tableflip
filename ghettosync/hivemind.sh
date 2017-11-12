#!/bin/sh

set -e

abort() {
    echo "hivemind aborted: $@"
    exit 1
}

log() {
    echo "$(date --iso-8601=seconds): $@" >> /var/log/ghettosync/hivemind.log
}

AM_TRUE_MASTER=1
MY_IP="104.238.128.152"
PARTNER_IP="45.77.147.104"

STATUS_FILE="ghettosync_status"
ROLE_FILE="ghettosync_role"

STATUS_PATH="/var/www/html/$STATUS_FILE"
ROLE_PATH="/var/www/html/$ROLE_FILE"

EXECUTABLES_DIR="/opt/ghettosync"
ROLE_SLAVE_SCRIPT="$EXECUTABLES_DIR/role_slave.sh"
ROLE_MASTER_SCRIPT="$EXECUTABLES_DIR/role_master.sh"
STATUS_STANDBY_SCRIPT="$EXECUTABLES_DIR/status_standby.sh"
STATUS_ACTIVE_SCRIPT="$EXECUTABLES_DIR/status_active.sh"

PING_INTERVAL=5

while true
do
    my_role="$(cat $STATUS_PATH)"
    my_status="$(cat $ROLE_PATH)"
    # Our status should always be "active" by the end of the full loop

    partner_status="$(curl http://$PARTNER_IP/$STATUS_FILE)"
    partner_role="$(curl http://$PARTNER_IP/$ROLE_FILE)"

    if echo $partner_status | grep --silent "404"; then
        partner_status="404"
        partner_role="404"
    fi

    log "This is: $my_role ($my_status); partner: $partner_role ($partner_status)"

    if [ "$my_role" = "MASTER" ]; then
        if [ "$partner_role" = "MASTER" ]; then
            log "Both of us want to be master."

            if [ $AM_TRUE_MASTER -eq 1 ]; then
                log "We are the true master. Waiting for slave to submit..."
                # Wait until the slave submits to our rule or dies
                $STATUS_STANDBY_SCRIPT
                while true
                do
                    partner_role="$(curl http://$PARTNER_IP/$ROLE_FILE)"
                    partner_status="$(curl http://$PARTNER_IP/$STATUS_FILE)"

                    log "(Waiting) This is: $my_role ($my_status); partner: $partner_role ($partner_status)"

                    if echo "$partner_role" | grep --silent "404"; then
                        break
                        log "Slave has died. Order is restored."
                    fi

                    if [ "$partner_role" = "SLAVE" ] && [ "$partner_status" = "ACTIVE" ]; then
                        break
                        log "Slave has submitted. Order is restored."
                    fi

                    sleep $PING_INTERVAL
                done

                log "Order restored, going active."
                $STATUS_ACTIVE_SCRIPT
            elif [ $AM_TRUE_MASTER -eq 0 ]; then
                # We must become the slave
                log "We must submit to the true master."

                $STATUS_STANDBY_SCRIPT
                $ROLE_SLAVE_SCRIPT
                $STATUS_ACTIVE_SCRIPT

                log "Finished becoming slave."
            else
                abort "Bad AM_TRUE_MASTER value: $AM_TRUE_MASTER"
            fi
        fi
    elif [ "$my_role" = "SLAVE" ]; then
        if [ "$partner_role" = "SLAVE" ]; then
            log "Both of us want to be the slave."

            if [ $AM_TRUE_MASTER -eq 1 ]; then
                log "We are the true master, and will assume the role."
                $STATUS_STANDBY_SCRIPT
                $ROLE_MASTER_SCRIPT
                $STATUS_ACTIVE_SCRIPT
            elif [ $AM_TRUE_MASTER -eq 0 ]; then
                log "We are the slave. The master will become so eventually."
                # Do nothing. We'll acquire the master when they come online.
                :
            fi
        elif [ "$partner_role" = "404" ]; then
            log "Our master has died. We become the master."

            $STATUS_STANDBY_SCRIPT
            $ROLE_MASTER_SCRIPT
            $STATUS_ACTIVE_SCRIPT

            log "Finished becoming master."
        fi
    fi

    sleep $PING_INTERVAL
done