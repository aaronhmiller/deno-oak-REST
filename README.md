# deno-oak-REST

```
project/
├── app.ts
├── deps.ts
├── Dockerfile
├── docker-compose.yml
├── .env
└── db/
    └── init.sql
```

The .env is not here for security, but it will contain your DB_USER, DB_PASSWORD, and DB_NAME

## usage

bring the stack up with `docker compose up -d` and down with either `docker compose down` (preserves the database contents in a volume) or `docker compose down --volumes` (which removes the volume and forces a complete refresh when bringing the stack back).

