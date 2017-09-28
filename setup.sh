pip install -r requirements.txt
sql/create_db.sh
psql tableflip -a -f sql/create_tables.sql
psql tableflip -a -f sql/sample_data.sql
