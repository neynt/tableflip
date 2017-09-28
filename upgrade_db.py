from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO

# upgrade database and upgrade the version
api.upgrade(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)

version = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)

print('Current database version: ' + str(version))
