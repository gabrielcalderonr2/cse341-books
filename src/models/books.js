
const getAllBooks = async (database) => {
  return await database
    .collection('books')
    .find({})
    .toArray();
};

const getBookById = async (database, bookId) => {
  return await database
    .collection('books')
    .findOne({ id: bookId });
};

const createBook = async (database, book) => {
  await database.collection('books').insertOne(book);
  return book;
};

const updateBook = async (database, bookId, book) => {
  await database
    .collection('books')
    .updateOne({ id: bookId }, { $set: book });

  return { id: bookId, ...book };
};

const deleteBook = async (database, bookId) => {
  return await database
    .collection('books')
    .deleteOne({ id: bookId });
};

const authorExists = async (database, authorId) => {
  const author = await database
    .collection('authors')
    .findOne({ id: authorId });

  return Boolean(author);
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
};
