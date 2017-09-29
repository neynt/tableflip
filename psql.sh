#!/bin/bash
# Connects to the staging PostgreSQL database.
# Will prompt for password if .env does not contain it.
[[ -f .env ]] && export $(cat .env | xargs)
psql -h utena.neynt.ca -U tableflip_staging tableflip_staging
