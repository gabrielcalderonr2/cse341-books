
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

const sampleBooks = [
  {
    id: 'b1',
    authorId: 'a4',
    title: 'Patterns of Light',
    publicationDate: '2021-08-17'
  },
  {
    id: 'b2',
    authorId: 'a5',
    title: 'The Silent Mountain',
    publicationDate: '2022-05-10'
  },
  {
    id: 'b3',
    authorId: 'a6',
    title: 'Beyond the Horizon',
    publicationDate: '2023-11-25'
  }
];

const sampleAuthors = [
  { id: 'a4', name: 'Maya Rivera', birthYear: 1985 },
  { id: 'a5', name: 'John Carter', birthYear: 1980 },
  { id: 'a6', name: 'Sarah Mitchell', birthYear: 1990 }
];

const createMockDatabase = (shouldFail = false) => {
  const books = sampleBooks.map((book) => {return { ...book }});
  const authors = sampleAuthors.map((author) => {return { ...author }});

  return {
    collection: (collectionName) => {
      const data = collectionName === 'authors' ? authors : books;

      return {
        find: () => {return {
          toArray: async () => {
            if (shouldFail) {
              throw new Error('Database connection failed');
            }

            return data;
          }
        }},

        findOne: async (query) => {
          if (shouldFail) {
            throw new Error('Database connection failed');
          }

          return data.find((item) => {return item.id === query.id}) || null;
        },

        insertOne: async (document) => {
          if (shouldFail) {
            throw new Error('Database connection failed');
          }

          data.push({ ...document });
          return { acknowledged: true };
        },

        updateOne: async (query, update) => {
          if (shouldFail) {
            throw new Error('Database connection failed');
          }

          const item = data.find((entry) => {return entry.id === query.id});

          if (!item) {
            return { matchedCount: 0 };
          }

          Object.assign(item, update.$set);
          return { matchedCount: 1 };
        },

        deleteOne: async (query) => {
          if (shouldFail) {
            throw new Error('Database connection failed');
          }

          const index = data.findIndex((item) => {return item.id === query.id});

          if (index === -1) {
            return { deletedCount: 0 };
          }

          data.splice(index, 1);
          return { deletedCount: 1 };
        }
      };
    }
  };
};

describe('GET /books', () => {
  it('should return all books with status 200', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).get('/books');

    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'], /application\/json/);
    assert.ok(Array.isArray(response.body));
    assert.equal(response.body.length, 3);
    assert.equal(response.body[0].id, 'b1');
    assert.equal(response.body[0].authorId, 'a4');
    assert.equal(response.body[0].title, 'Patterns of Light');
  });

  it('should return status 500 when the database fails', async () => {
    const app = createApp(() => {return createMockDatabase(true)});

    const response = await request(app).get('/books');

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: 'Internal server error'
    });
  });
});

describe('GET /books/:id', () => {
  it('should return a book with status 200 when it exists', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).get('/books/b1');

    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'], /application\/json/);
    assert.equal(response.body.id, 'b1');
    assert.equal(response.body.authorId, 'a4');
    assert.equal(response.body.title, 'Patterns of Light');
  });

  it('should return status 404 when the book does not exist', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).get('/books/unknown');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, {
      message: 'Book not found'
    });
  });

  it('should return status 500 when the database fails', async () => {
    const app = createApp(() => {return createMockDatabase(true)});

    const response = await request(app).get('/books/b1');

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: 'Internal server error'
    });
  });
});

describe('POST /books', () => {
  it('should create a book with status 201', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const newBook = {
      id: 'b4',
      authorId: 'a4',
      title: 'A New Beginning',
      publicationDate: '2024-01-15'
    };

    const response = await request(app)
      .post('/books')
      .send(newBook);

    assert.equal(response.status, 201);
    assert.equal(response.body.id, 'b4');
    assert.equal(response.body.authorId, 'a4');
    assert.equal(response.body.title, 'A New Beginning');
  });

  it('should return status 400 when book fields are missing', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app)
      .post('/books')
      .send({
        id: 'b4',
        title: 'A New Beginning'
      });

    assert.equal(response.status, 400);
  });

  it('should return status 400 when the book ID already exists', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app)
      .post('/books')
      .send({
        id: 'b1',
        authorId: 'a4',
        title: 'Duplicate Book',
        publicationDate: '2024-01-15'
      });

    assert.equal(response.status, 400);
  });

  it('should return status 400 when the author does not exist', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app)
      .post('/books')
      .send({
        id: 'b4',
        authorId: 'unknown',
        title: 'A New Beginning',
        publicationDate: '2024-01-15'
      });

    assert.equal(response.status, 400);
  });
});

describe('PUT /books/:id', () => {
  it('should update a book with status 200', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const updatedBook = {
      authorId: 'a5',
      title: 'Updated Book Title',
      publicationDate: '2024-02-20'
    };

    const response = await request(app)
      .put('/books/b1')
      .send(updatedBook);

    assert.equal(response.status, 200);
    assert.equal(response.body.id, 'b1');
    assert.equal(response.body.authorId, 'a5');
    assert.equal(response.body.title, 'Updated Book Title');
    assert.equal(response.body.publicationDate, '2024-02-20');
  });

  it('should return status 400 when the author does not exist', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app)
      .put('/books/b1')
      .send({
        authorId: 'unknown',
        title: 'Updated Book Title',
        publicationDate: '2024-02-20'
      });

    assert.equal(response.status, 400);
  });

  it('should return status 404 when the book does not exist', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app)
      .put('/books/unknown')
      .send({
        authorId: 'a4',
        title: 'Updated Book Title',
        publicationDate: '2024-02-20'
      });

    assert.equal(response.status, 404);
  });
});

describe('DELETE /books/:id', () => {
  it('should delete a book with status 204', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).delete('/books/b1');

    assert.equal(response.status, 204);
    assert.equal(response.text, '');
  });

  it('should return status 404 when the book does not exist', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).delete('/books/unknown');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, {
      message: 'Book not found'
    });
  });
});
