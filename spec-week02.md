# Books API Week 02 Specification

# Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Goal
Create an authors API that supports all CRUD operations. Authors will be stored in a separate MongoDB collection. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Books will reference authors through the `authorId` field.

An author cannot be deleted if one or more books reference that author. The API should return a `409` status code if the author still has associated books.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a1",
      "name": "John Smith",
      "birthYear": 1980
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing or invalid
- `400` if the author id already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "John Smith Updated",
      "birthYear": 1982
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing or invalid
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has associated books
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route, including request bodies, response codes, and possible errors.

### Deployment Expectations
After implementation, all author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

# Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 Books API to support complete CRUD operations and establish a valid relationship between books and authors. All endpoints must be documented and testable through Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required fields:
- `id`: string, required, unique custom identifier such as `b1`.
- `authorId`: string, required, references an existing author's custom `id`.
- `title`: string, required, non-empty string.
- `publicationDate`: string, required, valid date in `YYYY-MM-DD` format.

MongoDB `_id` will remain an internal database identifier. All API routes and relationships will use custom string IDs.

### Relationship to Authors
- Every book must reference an existing author through `authorId`.
- The API must validate the author before creating or updating a book.
- Invalid or nonexistent author references must return `400 Bad Request`.
- Deleting an author with associated books must be prevented.

### Routes

#### GET /books
Purpose: Retrieve all books.

Success:
- `200 OK`
- Response body: JSON array of book objects.

Errors:
- `500 Internal Server Error` if an unexpected database or server error occurs.

#### GET /books/:id
Purpose: Retrieve a book by its custom ID.

Success:
- `200 OK`
- Response body: one book object.

Errors:
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- `201 Created`
- Response body: the newly created book object.

Errors:
- `400 Bad Request` if a required field is missing, empty, or invalid.
- `400 Bad Request` if the custom ID already exists.
- `400 Bad Request` if the author ID does not reference an existing author.
- `500 Internal Server Error` if an unexpected error occurs.

#### PUT /books/:id
Purpose: Replace the editable information of an existing book.

The route parameter `:id` identifies the book. The request body must include all editable fields.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- `200 OK`
- Response body: the updated book object.

Errors:
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the new author ID does not reference an existing author.
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

The custom book ID must not be changed through the request body.

#### DELETE /books/:id
Purpose: Delete a book by its custom ID.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

### Validation and Security
- Validate all request bodies before database operations.
- Reject missing, empty, or incorrectly typed fields.
- Validate dates using the `YYYY-MM-DD` format and reject invalid calendar dates.
- Do not allow clients to modify MongoDB internal `_id` values.
- Do not expose database credentials, connection strings, or internal error details.
- Use environment variables for database configuration.
- Return consistent JSON error messages for unsuccessful requests.
- Do not accept unexpected fields that could modify protected database properties.

### Database and Efficiency
- Create a unique index on the custom `id` field.
- Create an index on `authorId` to improve relationship queries.
- Use database queries that retrieve only the necessary documents.
- Avoid unnecessary database requests when validating and creating records.

### Swagger Documentation
Swagger must document:
- All five book routes.
- Path parameters and their descriptions.
- Required request body properties and data types.
- Example JSON request bodies.
- Successful response codes and response schemas.
- Possible error codes and descriptions.

### Deployment Expectations
All book routes must work locally and on Render. The deployed `/api-docs` page must allow users to execute and test all book endpoints.

---

## Feature 2: Author CRUD Operations

### Goal
Create an Authors API that supports complete CRUD operations and maintains valid relationships with books. All author endpoints must be documented and testable through Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required fields:
- `id`: string, required, unique custom identifier such as `a1`.
- `name`: string, required, non-empty string.
- `birthYear`: number, required, integer representing the author's year of birth.

MongoDB `_id` will remain internal. All API routes and book relationships will use the author's custom `id`.

### Relationship to Books
- Books reference authors through the `authorId` field.
- An author can have multiple books.
- An author cannot be deleted while books reference their ID.
- Before deleting an author, the API must check whether associated books exist.
- If associated books exist, return `409 Conflict` without deleting the author.

### Routes

#### GET /authors
Purpose: Retrieve all authors.

Success:
- `200 OK`
- Response body: JSON array of author objects.

Example response:

    [
      {
        "id": "a1",
        "name": "John Smith",
        "birthYear": 1980
      },
      {
        "id": "a2",
        "name": "Mary Johnson",
        "birthYear": 1975
      }
    ]

Errors:
- `500 Internal Server Error` if an unexpected database or server error occurs.

#### GET /authors/:id
Purpose: Retrieve one author by their custom ID.

Success:
- `200 OK`
- Response body: the matching author object.

Errors:
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a1",
      "name": "John Smith",
      "birthYear": 1980
    }

Success:
- `201 Created`
- Response body: the newly created author object.

Errors:
- `400 Bad Request` if a required field is missing, empty, or invalid.
- `400 Bad Request` if the custom author ID already exists.
- `500 Internal Server Error` if an unexpected error occurs.

Validation rules:
- `id` must be a non-empty string.
- `name` must be a non-empty string.
- `birthYear` must be an integer and must not be greater than the current year.
- The custom ID must be unique.

#### PUT /authors/:id
Purpose: Update an existing author's information.

The route parameter `:id` identifies the author. The custom ID cannot be changed.

Request body:

    {
      "name": "John Smith Updated",
      "birthYear": 1982
    }

Success:
- `200 OK`
- Response body: the updated author object.

Errors:
- `400 Bad Request` if a required field is missing, empty, or invalid.
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

Validation rules:
- `name` must be a non-empty string.
- `birthYear` must be an integer and must not be greater than the current year.
- The route ID must match an existing author.
- The custom ID must not be modified.

#### DELETE /authors/:id
Purpose: Delete an author by their custom ID.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the author does not exist.
- `409 Conflict` if one or more books still reference the author.
- `500 Internal Server Error` if an unexpected error occurs.

The API must check the books collection before deleting an author. If associated books exist, the deletion must be rejected to prevent orphaned book references.

### Validation and Security
- Validate all request bodies before database operations.
- Reject missing, empty, or incorrectly typed fields.
- Validate that birth years are integers and not future years.
- Do not allow clients to modify MongoDB internal `_id` values.
- Do not allow the custom author ID to be changed through PUT.
- Do not expose database credentials or internal server errors.
- Use environment variables for database configuration.
- Return consistent JSON error messages.
- Do not accept unexpected fields that could modify protected database properties.

### Database and Efficiency
- Create a unique index on the custom `id` field in the authors collection.
- Use an indexed query on `authorId` when checking whether an author has associated books.
- Use database queries that retrieve only the necessary information.
- Prevent deletion when associated books exist.

### Swagger Documentation
Swagger must document:
- All five author routes.
- Path parameters and their descriptions.
- Required request body properties and data types.
- Example JSON request and response bodies.
- Successful response codes and error codes.
- The `409 Conflict` response when deleting an author with associated books.

### Deployment Expectations
All author routes must work locally and on Render. The deployed Swagger page at `/api-docs` must allow users to execute and test all author endpoints.

---

## General API Requirements

- Both collections must use custom string IDs.
- MongoDB `_id` values must remain internal.
- All endpoints must use consistent JSON response structures.
- All routes must handle unexpected errors without exposing sensitive information.
- Swagger documentation must be complete for every endpoint.
- The application must work locally and on the deployed Render environment.
- All endpoints must be tested through Swagger at `/api-docs`.