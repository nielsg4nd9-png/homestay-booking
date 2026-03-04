#!/bin/sh
set -e
# sync schema กับ DB (PostgreSQL) — รันทุกครั้ง ใช้เวลาไม่นานถ้ามีแล้ว
cd /app && npx prisma db push --accept-data-loss 2>/dev/null || true
exec "$@"
