
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

export { getAllBooks, getBookById };
