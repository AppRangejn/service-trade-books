# Book Exchange Service — Frontend

## Технологічний стек

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **UI:** Material UI (MUI), Emotion
- **State & API:** Redux Toolkit, React Redux, RTK Query
- **Forms & validation:** Formik, Yup

---

## Швидкий старт

### 1. Клонування репозиторію

```bash
git clone https://github.com/AppRangejn/service-trade-books.git
cd service-trade-books/frontend
```

### 2. Встановлення залежностей

Потрібен Node.js 20.9 або новіший.

```bash
npm install
```

### 3. Налаштування змінних середовища

Скопіюйте шаблон `.env.example` у локальний файл `.env.local`:

```bash
cp .env.example .env.local
```

Вкажіть URL backend API:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Якщо `NEXT_PUBLIC_API_URL` не задано, застосунок використовує `http://localhost:5000/api`. Змінні з префіксом `NEXT_PUBLIC_` доступні у браузері; не зберігайте в них секрети. Для production задайте адресу розгорнутого backend до запуску build-команди.

### 4. Запуск backend

Frontend надсилає запити до backend API. Перед використанням застосунку запустіть backend і переконайтеся, що його адреса збігається з `NEXT_PUBLIC_API_URL`. Для локального запуску та інструкцій із PostgreSQL дивіться [backend/README.md](../backend/README.md).

Для локального frontend/backend налаштуйте backend CORS так, щоб дозволити origin `http://localhost:3000`.

### 5. Запуск frontend

Режим розробки з hot reload:

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000).

## Збірка та запуск

Створення production-збірки:

```bash
npm run build
```

Запуск зібраного застосунку:

```bash
npm start
```

Production-сервер Next.js за замовчуванням буде доступний на `http://localhost:3000`. Переконайтеся, що backend доступний за налаштованим `NEXT_PUBLIC_API_URL`.

## Перевірки коду

Запустити ESLint:

```bash
npm run lint
```

## Сторінки та можливості

| Сторінка | Доступ | Опис |
|---|---|---|
| `/` | Public | Головна сторінка та навігація сервісом |
| `/register` | Public | Реєстрація |
| `/login` | Public | Вхід |
| `/forgot-password` | Public | Запит на скидання пароля та встановлення нового за reset token |
| `/books` | Public | Каталог книг із пошуком, сортуванням, пагінацією та доступними діями |
| `/books/:id` | Public | Деталі книги, запит на обмін, видалення для власника або адміністратора |
| `/me/books` | Auth | Список, додавання й видалення власних книг |
| `/profile` | Auth | Перегляд і редагування профілю |
| `/admin` | Admin | Сторінка керування користувачами |

## Авторизація та API

Для коректної роботи frontend очікує, що backend API підтримує такі маршрути:

- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- `/api/auth/forgot-password`, `/api/auth/reset-password`
- `/api/profile` (`GET`, `PATCH`)
- `/api/books`, `/api/books/:id`, `/api/books/:id/exchange`
- `/api/me/books`
- `/api/admin/users` та `/api/admin/users/:id`
