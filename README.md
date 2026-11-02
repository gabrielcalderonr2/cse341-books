# Books Web Service

## Description

This project is a RESTful web service developed with Node.js, Express, and MongoDB. It provides endpoints to retrieve information about books stored in a MongoDB database.

## Technologies

- Node.js
- Express
- MongoDB Atlas
- JavaScript (ES Modules)

## API Base URL

https://cse341-books-m1ou.onrender.com

## Endpoints

### 1. Get all books

**GET** `/books`

Returns all books stored in the database.

Example response:

```json
[
  {
    "id": "b1",
    "author": "Maya Rivera",
    "title": "Patterns of Light",
    "publicationDate": "2021-08-17"
  }
]
```

### 2. Get a book by ID

**GET** `/books/:id`

Returns a specific book using its ID.

Example: `/books/b1`

If the book does not exist, the API returns HTTP 404 with a `Book not found` message.

## Error Handling

- **200 OK:** Request completed successfully.
- **404 Not Found:** The requested book does not exist.
- **500 Internal Server Error:** An unexpected error occurred while retrieving book data.

## Deployment

The API is deployed on Render and uses MongoDB Atlas for data storage.
