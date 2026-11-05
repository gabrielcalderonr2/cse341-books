
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

const sampleBooks = [
  {
    id: 'b1',
    author: 'Maya Rivera',
    title: 'Patterns of Light',
    publicationDate: '2021-08-17'
  },
  {
    id: 'b2',
    author: 'John Carter',
    title: 'The Silent Mountain',
    publicationDate: '2022-05-10'
  },
  {
    id: 'b3',
    author: 'Sarah Mitchell',
    title: 'Beyond the Horizon',
    publicationDate: '2023-11-25'
  }
];

const createMockDatabase = (shouldFail = false) => {
  return {
    collection: () => {
      return {
        find: () => {
          return {
            toArray: async () => {
              if (shouldFail) {
                throw new Error('Database connection failed');
              }

              return sampleBooks;
            }
          };
        },
        findOne: async (query) => {
          if (shouldFail) {
            throw new Error('Database connection failed');
          }

          return sampleBooks.find((book) => {
            return book.id === query.id;
          }) || null;
        }
      };
    }
  };
};

describe('GET /books', () => {
  it('should return all books with status 200', async () => {
    const app = createApp(() => {
      return createMockDatabase();
    });

    const response = await request(app).get('/books');

    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'], /application\/json/);
    assert.ok(Array.isArray(response.body));
    assert.equal(response.body.length, 3);
    assert.equal(response.body[0].id, 'b1');
    assert.equal(response.body[0].title, 'Patterns of Light');
  });

  it('should return status 500 when the database fails', async () => {
    const app = createApp(() => {
      return createMockDatabase(true);
    });

    const response = await request(app).get('/books');

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: 'Failed to retrieve books'
    });
  });
});

describe('GET /books/:id', () => {
  it('should return a book with status 200 when it exists', async () => {
    const app = createApp(() => {
      return createMockDatabase();
    });

    const response = await request(app).get('/books/b1');

    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'], /application\/json/);
    assert.equal(response.body.id, 'b1');
    assert.equal(response.body.author, 'Maya Rivera');
    assert.equal(response.body.title, 'Patterns of Light');
  });

  it('should return status 404 when the book does not exist', async () => {
    const app = createApp(() => {
      return createMockDatabase();
    });

    const response = await request(app).get('/books/unknown');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, {
      message: 'Book not found'
    });
  });

  it('should return status 500 when the database fails', async () => {
    const app = createApp(() => {
      return createMockDatabase(true);
    });

    const response = await request(app).get('/books/b1');

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: 'Failed to retrieve book'
    });
  });
});
