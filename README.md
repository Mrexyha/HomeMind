# HomeMind - Система керування розумним будинком

Система керування розумним будинком із адаптивною автоматизацією через AI.

## Архітектура

Проєкт складається з наступних компонентів:

- **Frontend** (React) - панель управління, налаштування автоматизацій, візуалізація даних
- **Backend** (NestJS) - REST API, авторизація, бізнес-логіка
- **ML Service** (Python FastAPI) - тренування моделей та inference
- **Simulators** (Node.js/Python) - симуляція пристроїв та телеметрії
- **PostgreSQL** - база даних
- **Redis** - кеш/черга (опціонально)
- **MQTT Broker** (Mosquitto) - для IoT-повідомлень

## Швидкий старт

### Вимоги

- Docker та Docker Compose
- Node.js 20+ (для локальної розробки)
- Python 3.11+ (для локальної розробки ML-сервісу)

### Запуск через Docker Compose

1. Клонуйте репозиторій:
```bash
git clone <repository-url>
cd HomeMind
```

2. Запустіть всі сервіси:
```bash
docker-compose up -d
```

3. Дочекайтесь, поки всі сервіси запустяться (перевірте логи):
```bash
docker-compose logs -f
```

4. Відкрийте браузер:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - ML Service: http://localhost:8000
   - MQTT Broker: mqtt://localhost:1883

### Перший вхід

1. Відкрийте http://localhost:5173
2. Зареєструйте нового користувача
3. Створіть пристрої та автоматизації

## Локальна розробка

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend буде доступний на http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend буде доступний на http://localhost:5173

### ML Service

```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

ML Service буде доступний на http://localhost:8000

### Симулятори

MQTT симулятор:
```bash
cd simulators
npm install
MQTT_BROKER=mqtt://localhost:1883 API_URL=http://localhost:3000 node simulate_mqtt.js
```

Python симулятор користувача:
```bash
cd simulators
python simulate_user.py --profile office_worker --start 2025-12-01
```

## API Документація

### Авторизація

- `POST /auth/login` - Вхід
- `POST /auth/register` - Реєстрація
- `GET /auth/me` - Поточний користувач

### Пристрої

- `GET /api/devices` - Список пристроїв
- `POST /api/devices` - Створити пристрій
- `GET /api/devices/:id` - Отримати пристрій
- `PATCH /api/devices/:id` - Оновити пристрій
- `DELETE /api/devices/:id` - Видалити пристрій
- `POST /api/devices/:id/command` - Відправити команду

### Автоматизації

- `GET /api/automations` - Список автоматизацій
- `POST /api/automations` - Створити автоматизацію
- `GET /api/automations/:id` - Отримати автоматизацію
- `PATCH /api/automations/:id` - Оновити автоматизацію
- `DELETE /api/automations/:id` - Видалити автоматизацію
- `POST /api/automations/:id/execute` - Виконати автоматизацію

### Телеметрія

- `POST /api/telemetry` - Надіслати телеметрію (для симуляторів)
- `GET /api/telemetry?deviceId=:id&from=:from&to=:to` - Отримати телеметрію

### ML Service

- `POST /ml/train` - Запустити тренування моделі
- `GET /ml/status/:run_id` - Статус тренування
- `POST /ml/infer` - Отримати рекомендації

## Структура бази даних

Основні таблиці:

- `users` - користувачі
- `devices` - пристрої
- `device_data` - телеметрія
- `automations` - автоматизації
- `scenes` - сцени
- `logs` - логи
- `ml_models` - ML моделі
- `model_runs` - запуски тренувань

## Налаштування

### Змінні середовища

Backend (.env):
```
DATABASE_URL=postgresql://homemind:homemind_pass@localhost:5432/homemind_db
JWT_SECRET=your-secret-key
PORT=3000
```

Frontend (.env):
```
VITE_API_URL=http://localhost:3000
```

ML Service (.env):
```
DATABASE_URL=postgresql://homemind:homemind_pass@localhost:5432/homemind_db
```

## Тестування

### Backend
```bash
cd backend
npm test
```

### ML Service
```bash
cd ml-service
pytest
```

## Розгортання

Для production:

1. Змініть `JWT_SECRET` на безпечний ключ
2. Встановіть `NODE_ENV=production` для backend
3. Налаштуйте HTTPS
4. Використовуйте production базу даних
5. Налаштуйте моніторинг та логи

## Ліцензія

Див. файл LICENSE

## Автори

Розроблено для курсової роботи
