# Aveibeck Backend

Node.js приложение на TypeScript с WebSocket и MySQL.

## Запуск

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Соберите проект:
   ```bash
   npm run build
   ```
3. Запустите сервер:
   ```bash
   npm start
   ```

## Конфигурация MySQL

Измените параметры подключения к базе данных в `src/index.ts`:

- `host`, `user`, `password`, `database`

## WebSocket

Сервер запускается на `ws://localhost:8080`.
