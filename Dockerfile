# frontend/Dockerfile

# ---- Стадия сборки ----
# Устанавливаем зависимости и собираем статический бандл
FROM node:22-alpine AS build

# URL бэкенда (передаётся через --build-arg, по умолчанию из .env)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходники
COPY . .

# Собираем приложение
RUN npm run build


# ---- Стадия продакшена ----
# Раздаём статику через Nginx
FROM nginx:stable-alpine

# Копируем собранные файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
