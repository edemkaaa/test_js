
   ## Установка

   1. Клонируйте репозиторий:
      ```bash
      git clone https://github.com/ваш_пользователь/ваш_репозиторий.git
      cd ваш_репозиторий
      ```

   2. Установите зависимости:
      ```bash
      npm install
      ```

   ## Запуск

   3. Соберите проект:
      ```bash
      npm run build
      ```

   4. Запустите сервер:
      ```bash
      node server.js
      ```

   5. Откройте браузер и перейдите по адресу:
      ```
      http://localhost:3000
      ```

   ## Документация API

   Документация API доступна по адресу: http://localhost:3000/api-docs

   ## Тестирование API

   Для тестирования API можно использовать инструменты, такие как Postman или curl.
 По ссылке: http://localhost:3000/api/events

 Пример запроса: 
 {
  "name": "Новое событие",
  "description": "Описание события",
  "date_periods": [
    {
      "start": "2023-10-01T10:00:00Z",
      "end": "2023-10-01T12:00:00Z"
    }
  ],
  "venue": {
    "name": "Место проведения",
    "timezone": "Europe/Moscow" ## Обязательно существующую таймзону
  },
  "thumbnail": "http://example.com/image.png",
  "status": "ACTIVE"
}