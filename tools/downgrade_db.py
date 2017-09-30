from migrate.versioning import api
from api.config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO

curr_version = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
api.downgrade(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO, curr_version - 1)

new_version= api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
print('Current database version: ' + str(new_version))
