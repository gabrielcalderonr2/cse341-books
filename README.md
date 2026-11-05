# Books Web Service

## Description

This project is a RESTful web service developed using Node.js, Express,
and MongoDB. It provides endpoints to retrieve information about books
stored in a MongoDB database.

The API supports retrieving all books and retrieving an individual book
by its ID.

## Technologies

-   Node.js
-   Express.js
-   MongoDB Atlas
-   MongoDB Node.js Driver
-   JavaScript (ES Modules)
-   Supertest
-   Node.js Test Runner

## API Base URL

The API is deployed on Render:

https://cse341-books-m1ou.onrender.com

## API Endpoints

### 1. Get All Books

**GET** `/books`

Returns all books stored in the database.

Example request:

``` text
GET https://cse341-books-m1ou.onrender.com/books
```

Example response:

``` json
[
  {
    "id": "b1",
    "author": "Maya Rivera",
    "title": "Patterns of Light",
    "publicationDate": "2021-08-17"
  },
  {
    "id": "b2",
    "author": "John Carter",
    "title": "The Silent Mountain",
    "publicationDate": "2022-05-10"
  },
  {
    "id": "b3",
    "author": "Sarah Mitchell",
    "title": "Beyond the Horizon",
    "publicationDate": "2023-11-25"
  }
]
```

### 2. Get a Book by ID

**GET** `/books/:id`

Returns a specific book using its ID.

Example request:

``` text
GET https://cse341-books-m1ou.onrender.com/books/b1
```

Example response:

``` json
{
  "id": "b1",
  "author": "Maya Rivera",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
```

If the requested book does not exist, the API returns HTTP 404.

Example error response:

``` json
{
  "message": "Book not found"
}
```

## HTTP Status Codes

  -----------------------------------------------------------------------
  Status Code                         Description
  ----------------------------------- -----------------------------------
  200 OK                              Request completed successfully.

  404 Not Found                       The requested book does not exist.

  500 Internal Server Error           An unexpected error occurred while
                                      retrieving book data.
  -----------------------------------------------------------------------

## Installation and Local Setup

1.  Clone the repository:

``` bash
git clone https://github.com/gabrielcalderonr2/cse341-books.git
```

2.  Navigate to the project directory:

``` bash
cd cse341-books
```

3.  Install dependencies:

``` bash
npm install
```

4.  Create a `.env` file in the project root and configure the following
    environment variables:

``` env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=cse341-books-db
```

Do not commit the `.env` file or expose your MongoDB credentials.

5.  Start the development server:

``` bash
npm run dev
```

The application runs locally on the configured port (default: 3000).

## Testing

Run the automated tests:

``` bash
npm test
```

Run ESLint to check code quality:

``` bash
npm run lint
```

The automated tests cover:

-   Retrieving all books successfully (HTTP 200).
-   Handling database errors when retrieving all books (HTTP 500).
-   Retrieving an existing book by ID (HTTP 200).
-   Handling a book that does not exist (HTTP 404).
-   Handling database errors when retrieving an individual book (HTTP
    500).

## Database Configuration

The application uses MongoDB Atlas.

The database name is:

`cse341-books-db`

The collection used by the API is:

`books`

Database credentials are configured through environment variables and
are not stored in the source code.

## Deployment

The API is deployed on Render and connects to MongoDB Atlas.

Production URL:

https://cse341-books-m1ou.onrender.com

## Author

Gabriel Calderón

GitHub: https://github.com/gabrielcalderonr2
