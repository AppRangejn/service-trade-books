# Book Exchange Service

## Можливості

- Реєстрація та вхід користувачів із JWT-авторизацією.
- Каталог книг із пошуком, сортуванням і пагінацією.
- Додавання та керування власними книгами.
- Запит на обмін книги з email-повідомленням власнику.
- Розмежування ролей користувача й адміністратора.

## Структура репозиторію

| Каталог | Призначення | Документація |
|---|---|---|
| [`frontend/`](./frontend/) | Next.js, TypeScript, React, MUI | [Frontend README](./frontend/README.md) |
| [`backend/`](./backend/) | Express, TypeScript, Sequelize, PostgreSQL | [Backend README](./backend/README.md) |

## Локальний запуск

Потрібні Node.js та PostgreSQL. Встановлюйте залежності й запускайте команди окремо в `backend/` і `frontend/`; кореневий каталог не має спільного npm workspace.

1. Налаштуйте PostgreSQL, змінні backend та запустіть API за інструкціями в [backend README](./backend/README.md). За потреби заповніть локальну базу тестовими даними командою `npm run seed` із каталогу `backend/`.
2. У `frontend/` скопіюйте `.env.example` у `.env.local` і перевірте адресу API:

   ```dotenv
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. У двох терміналах запустіть застосунки:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   API буде доступний на `http://localhost:5000`, frontend — на `http://localhost:3000`.

Повні налаштування середовища, production-збірка, тести та команди наведені в README відповідного застосунку.

## Перевірки та production-збірка

Для backend запустіть тести й TypeScript-збірку в каталозі `backend/`:

```bash
npm test
npm run build
```

Для frontend запустіть lint і production-збірку в каталозі `frontend/`:

```bash
npm run lint
npm run build
```

Перед production-запуском налаштуйте backend секрети, PostgreSQL і SMTP, а також задайте frontend змінну `NEXT_PUBLIC_API_URL` до створення збірки. Не використовуйте локальні тестові облікові дані або секрети з прикладів у production.
