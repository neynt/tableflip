#!/bin/bash

rm -r db
initdb db
pg_ctl -D db -l sql/logfile start
sleep 5
createdb tableflip
