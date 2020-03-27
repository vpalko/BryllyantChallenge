FROM postgres:latest
COPY init-db.sql /docker-entrypoint-initdb.d/
COPY init-tables.sql /docker-entrypoint-initdb.d/