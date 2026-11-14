
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

const sampleAuthors = [
  { id: 'a1', name: 'Jane Austen', birthYear: 1775 },
  { id: 'a2', name: 'George Orwell', birthYear: 1903 },
  { id: 'a3', name: 'Gabriel García Márquez', birthYear: 1927 },
];

const createMockDatabase = ({
  shouldFail = false,
  authors = sampleAuthors,
  books = [],
} = {}) => {
  const mockAuthors = [...authors];
  const mockBooks = [...books];

  return {
    collection: (collectionName) => {
      const data =
        collectionName === 'authors' ? mockAuthors : mockBooks;

      return {
        find: () => {return {
          toArray: async () => {
            if (shouldFail) {
              throw new Error('Database connection failed');
            }

            return data;
          },
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

          data.push(document);
          return { acknowledged: true };
        },

        updateOne: async (query, update) => {
          if (shouldFail) {
            throw new Error('Database connection failed');
          }

          const item = data.find((entry) => {return entry.id === query.id});

          if (item) {
            Object.assign(item, update.$set);
          }

          return { acknowledged: true, modifiedCount: item ? 1 : 0 };
        },

        deleteOne: async (query) => {
          if (shouldFail) {
            throw new Error('Database connection failed');
          }

          const index = data.findIndex(
            (item) => {return item.id === query.id}
          );

          if (index === -1) {
            return { acknowledged: true, deletedCount: 0 };
          }

          data.splice(index, 1);
          return { acknowledged: true, deletedCount: 1 };
        },

        countDocuments: async (query) => {
          if (shouldFail) {
            throw new Error('Database connection failed');
          }

          return data.filter(
            (book) => {return book.authorId === query.authorId}
          ).length;
        },
      };
    },
  };
};

describe('GET /authors', () => {
  it('should return all authors with status 200', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).get('/authors');

    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'], /application\/json/);
    assert.ok(Array.isArray(response.body));
    assert.equal(response.body.length, 3);
    assert.equal(response.body[0].id, 'a1');
    assert.equal(response.body[0].name, 'Jane Austen');
  });

  it('should return status 500 when the database fails', async () => {
    const app = createApp(() =>
      {return createMockDatabase({ shouldFail: true })}
    );

    const response = await request(app).get('/authors');

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: 'Unable to retrieve authors.',
    });
  });
});

describe('GET /authors/:id', () => {
  it('should return an author with status 200 when it exists', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).get('/authors/a1');

    assert.equal(response.status, 200);
    assert.match(response.headers['content-type'], /application\/json/);
    assert.equal(response.body.id, 'a1');
    assert.equal(response.body.name, 'Jane Austen');
    assert.equal(response.body.birthYear, 1775);
  });

  it('should return status 404 when the author does not exist', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).get('/authors/unknown');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, {
      message: 'Author not found.',
    });
  });

  it('should return status 500 when the database fails', async () => {
    const app = createApp(() =>
      {return createMockDatabase({ shouldFail: true })}
    );

    const response = await request(app).get('/authors/a1');

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: 'Unable to retrieve author.',
    });
  });
});

describe('POST /authors', () => {
  it('should create an author with status 201', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const newAuthor = {
      id: 'a4',
      name: 'Charles Dickens',
      birthYear: 1812,
    };

    const response = await request(app)
      .post('/authors')
      .send(newAuthor);

    assert.equal(response.status, 201);
    assert.deepEqual(response.body, newAuthor);
  });

  it('should return status 400 when the author fields are invalid', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app)
      .post('/authors')
      .send({
        id: '',
        name: '',
        birthYear: 3000,
      });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'Invalid or missing author fields.',
    });
  });

  it('should return status 400 when the author id already exists', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app)
      .post('/authors')
      .send({
        id: 'a1',
        name: 'Another Author',
        birthYear: 1980,
      });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'Author id already exists.',
    });
  });

  it('should return status 500 when the database fails', async () => {
    const app = createApp(() =>
      {return createMockDatabase({ shouldFail: true })}
    );

    const response = await request(app)
      .post('/authors')
      .send({
        id: 'a4',
        name: 'Charles Dickens',
        birthYear: 1812,
      });

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: 'Unable to create author.',
    });
  });
});

describe('PUT /authors/:id', () => {
  it('should update an author with status 200', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const updatedAuthor = {
      name: 'Jane Austen Updated',
      birthYear: 1775,
    };

    const response = await request(app)
      .put('/authors/a1')
      .send(updatedAuthor);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      id: 'a1',
      ...updatedAuthor,
    });
  });

  it('should return status 400 when the update fields are invalid', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app)
      .put('/authors/a1')
      .send({
        name: '',
        birthYear: 3000,
      });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: 'Invalid or missing author fields.',
    });
  });

  it('should return status 404 when the author does not exist', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app)
      .put('/authors/unknown')
      .send({
        name: 'Unknown Author',
        birthYear: 1980,
      });

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, {
      message: 'Author not found.',
    });
  });

  it('should return status 500 when the database fails', async () => {
    const app = createApp(() =>
      {return createMockDatabase({ shouldFail: true })}
    );

    const response = await request(app)
      .put('/authors/a1')
      .send({
        name: 'Jane Austen Updated',
        birthYear: 1775,
      });

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: 'Unable to update author.',
    });
  });
});

describe('DELETE /authors/:id', () => {
  it('should delete an author with status 204', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).delete('/authors/a1');

    assert.equal(response.status, 204);
  });

  it('should return status 404 when the author does not exist', async () => {
    const app = createApp(() => {return createMockDatabase()});

    const response = await request(app).delete('/authors/unknown');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, {
      message: 'Author not found.',
    });
  });

  it('should return status 409 when the author still has books', async () => {
    const app = createApp(() =>
      {return createMockDatabase({
        books: [
          {
            id: 'b1',
            authorId: 'a1',
            title: 'Example Book',
          },
        ],
      })}
    );

    const response = await request(app).delete('/authors/a1');

    assert.equal(response.status, 409);
    assert.deepEqual(response.body, {
      message: 'Author cannot be deleted because they still have books.',
    });
  });

  it('should return status 500 when the database fails', async () => {
    const app = createApp(() =>
      {return createMockDatabase({ shouldFail: true })}
    );

    const response = await request(app).delete('/authors/a1');

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      message: 'Unable to delete author.',
    });
  });
});
