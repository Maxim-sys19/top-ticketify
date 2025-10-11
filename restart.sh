#!/bin/bash

# Генерируем случайный ID для hostname
export RANDOM_ID=$(date +%s%N | sha1sum | cut -c1-6)

# Останавливаем контейнеры (чтобы пересоздать)
docker compose down

# Пересобираем и запускаем заново
docker compose up -d --build
