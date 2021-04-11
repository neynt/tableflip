#!/bin/bash
cd "$(dirname "$0")"

# Build game files for Node
cp -r ../games .
for r in `find games | grep rules`; do
  # JavaScript is awful
  sed -i"" -e "s/module.exports =/export default/" $r
done

# Start engine
exec node index.js
