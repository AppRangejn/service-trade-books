# Book Exchange Service — Backend

## Технологічний стек

- **Runtime & Framework:** Node.js, Express 5, TypeScript
- **Database & ORM:** PostgreSQL, Sequelize
- **Auth & Security:** JWT (`jsonwebtoken`), `bcrypt`, `helmet`, `cors`, `express-rate-limit`
- **Validation & Email:** `yup`, `nodemailer` (у development без SMTP-облікових даних використовується тестова скринька Ethereal)
- **Exchange workflow:** збереження запитів на обмін зі статусами `pending`, `accepted`, `rejected`
- **Testing:** Vitest, Supertest, REST Client (`.http`)

---

## Швидкий старт

### 1. Клонування репозиторію

```bash
git clone https://github.com/AppRangejn/service-trade-books.git
cd service-trade-books/backend
```

### 2. Створення бази даних PostgreSQL

Переконайтеся, що PostgreSQL запущений, та створіть базу даних для проєкту:

```bash
psql -U postgres -c 'CREATE DATABASE "service-trade-books";'
```

Або створіть базу даних `service-trade-books` через pgAdmin чи DBeaver.

### 3. Встановлення залежностей

```bash
npm install
```

### 4. Налаштування змінних середовища

Скопіюйте шаблон `.env.example` у локальний файл `.env`:

```bash
cp .env.example .env
```

Для генерації надійного `JWT_SECRET` у Linux/macOS виконайте:

```bash
openssl rand -base64 32
```

Налаштуйте `.env` для локального запуску:

```dotenv
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=service-trade-books
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=ваш_згенерований_секрет
JWT_EXPIRES_IN=7d

# Якщо SMTP_USER або SMTP_PASS порожні, у development буде використано Ethereal.
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Book Club <noreply@bookclub.local>"
```

Для хмарної PostgreSQL замість `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` і `DB_PASSWORD` можна вказати `DATABASE_URL`; за потреби налаштуйте `DB_SSL` та `DB_SSL_REJECT_UNAUTHORIZED`. У production необхідно вказати валідні SMTP-облікові дані.

`JWT_SECRET` має бути не коротшим за 32 символи. Значення-заглушка з `.env.example` потрібно замінити на згенерований секрет до запуску сервера. `DB_SYNC_ALTER=true` призначений для локальної розробки; у production зміни схеми слід керувати окремо, а не вмикати автоматичний `alter`.

### 5. Наповнення бази тестовими даними

Запустіть сідер:

```bash
npm run seed
```

Сідер створює/оновлює таблиці через Sequelize та додає 5 учасників книжкового клубу і 12 книг. Якщо користувачі або книги вже є, відповідна частина сіду пропускається. Запускайте його лише на локальній базі для розробки: він створює тестові акаунти з відомими паролями.

#### Тестові акаунти

Пароль для всіх акаунтів: `password123`. Використовуйте ці облікові дані лише локально для розробки та тестування.

- **Admin:** `admin@bookclub.local`
- **Admin:** `moderator@bookclub.local`
- **User:** `maksym@bookclub.local`
- **User:** `iryna@bookclub.local`
- **User:** `dmytro@bookclub.local`

### 6. Запуск сервера

Режим розробки з hot reload:

```bash
npm run dev
```

Збірка та запуск:

```bash
npm run build
npm start
```

За замовчуванням API буде доступний за адресою `http://localhost:5000`.

## Тестування

### Автоматичні інтеграційні тести (Vitest + Supertest)

Перед запуском переконайтеся, що PostgreSQL доступний і змінні підключення до БД налаштовані в `.env`.
Тести використовують тестові книги й адміністратора з сіду, тому спочатку запустіть `npm run seed` на локальній базі.

```bash
npm test
```

### Ручне тестування (REST Client)

У папці `tests/` знаходяться `.http` сценарії для розширення REST Client у VS Code:

- `tests/auth.http` — реєстрація, вхід і отримання профілю `/api/auth/me`
- `tests/books.http` — каталог, пошук, сортування, пагінація, керування власними книгами та запит на обмін
- `tests/admin.http` — керування користувачами для ролі `Admin`

## Основні ендпоінти API

Усі ендпоінти мають префікс `/api`. Для захищених маршрутів передавайте JWT у заголовку `Authorization: Bearer <token>`.

| Метод | Ендпоінт | Доступ | Опис |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Реєстрація користувача |
| `POST` | `/api/auth/login` | Public | Вхід та отримання JWT |
| `GET` | `/api/auth/me` | Auth | Дані поточного користувача |
| `POST` | `/api/auth/forgot-password` | Public | Надіслати лист для скидання пароля |
| `POST` | `/api/auth/reset-password` | Public | Встановити новий пароль за reset token |
| `GET` | `/api/books` | Public | Каталог книг (`search`, `sort`, `page`, `limit`) |
| `GET` | `/api/books/:id` | Public | Детальна інформація про книгу |
| `POST` | `/api/books/:id/exchange` | Auth | Надіслати власнику книги email-запит на обмін |
| `GET` | `/api/me/books` | Auth | Список власних книг |
| `POST` | `/api/me/books` | Auth | Додати власну книгу |
| `PATCH` | `/api/me/books/:id` | Owner / Admin | Оновити книгу (поля `name`, `author`, `photo`) |
| `DELETE` | `/api/books/:id` | Owner / Admin | Видалити книгу |
| `GET` | `/api/profile` | Auth | Профіль та кількість власних книг |
| `PATCH` | `/api/profile` | Auth | Оновити ім’я, email або URL аватара |
| `GET` | `/api/profile/requests` | Auth | Список отриманих запитів на обмін |
| `PATCH` | `/api/profile/requests/:id` | Власник книги | Прийняти (`accepted`) або відхилити (`rejected`) запит |
| `GET` | `/api/admin/users` | Admin | Список користувачів |
| `POST` | `/api/admin/users` | Admin | Створити користувача |
| `PATCH` | `/api/admin/users/:id` | Admin | Оновити дані або роль користувача |
| `DELETE` | `/api/admin/users/:id` | Admin | Видалити користувача |
