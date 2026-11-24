import { Book, User } from '../models';

export const seedBooks = async (users: User[]): Promise<void> => {
  const existingCount = await Book.count();
  if (existingCount > 0) {
    console.log('Books already exist, skipping books seed.');
    return;
  }

  if (users.length < 5) {
    throw new Error('Not enough users to seed books');
  }

  const [olena, taras, maksym, iryna, dmytro] = users;

  const booksData = [
    {
      name: '1984',
      author: 'George Orwell',
      photo: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
      userId: olena.id,
    },
    {
      name: 'Dune',
      author: 'Frank Herbert',
      photo: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
      userId: olena.id,
    },
    {
      name: 'Clean Code',
      author: 'Robert C. Martin',
      photo: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
      userId: taras.id,
    },
    {
      name: 'The Pragmatic Programmer',
      author: 'Andrew Hunt, David Thomas',
      photo: 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',
      userId: taras.id,
    },
    {
      name: 'Atomic Habits',
      author: 'James Clear',
      photo: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
      userId: maksym.id,
    },
    {
      name: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      photo: 'https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg',
      userId: maksym.id,
    },
    {
      name: 'The Master and Margarita',
      author: 'Mikhail Bulgakov',
      photo: 'https://covers.openlibrary.org/b/isbn/9780679760801-L.jpg',
      userId: maksym.id,
    },
    {
      name: 'Pride and Prejudice',
      author: 'Jane Austen',
      photo: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
      userId: iryna.id,
    },
    {
      name: 'The Little Prince',
      author: 'Antoine de Saint-Exupéry',
      photo: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
      userId: iryna.id,
    },
    {
      name: 'Norwegian Wood',
      author: 'Haruki Murakami',
      photo: 'https://covers.openlibrary.org/b/isbn/9780375704024-L.jpg',
      userId: iryna.id,
    },
    {
      name: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      photo: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
      userId: dmytro.id,
    },
    {
      name: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      photo: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
      userId: dmytro.id,
    },
  ];

  await Book.bulkCreate(booksData);
  console.log(`Seeded ${booksData.length} books into the club catalog.`);
};
