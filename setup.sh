#!/bin/bash

# npm packages for web/ and engine/
(cd web && npm install)

# virtualenv for api/
[[ ! -d venv ]] && python3 -m venv venv
source venv/bin/activate

# pip packages for api/
pip install -r requirements.txt
