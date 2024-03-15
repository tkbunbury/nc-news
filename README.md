# Takai's News API



 **Welcome to TK-News!**


## Overview

This project implements a backend API for accessing application data programmatically. It mimics the functionality of a real-world backend service, providing information to the front-end architecture. The database used is __PostgreSQL__, and interaction with it is done using __node-postgres__.

This project uses __Husky__ to ensure that broken code is not committed. Husky sets up and maintains git hooks, triggering scripts during certain events in the git lifecycle. A pre-commit hook is configured to run tests before each commit. If any tests fail, the commit will be aborted.

## Getting Started

Link to the hosted version of this API ⤵️

    https://takai-nc-news.onrender.com/api


### Cloning the Repository

To clone the repository, follow these steps:

```bash
git clone https://github.com/tkbunbury/nc-news.git
cd nc-news
```

### Installing Dependencies

To install the project dependencies, run the following command:

```bash
npm install
```

### Seeding the Local Database

To seed the local database with initial data, follow these steps:

1. Make sure you have PostgreSQL installed and running on your local machine.
2. Navigate to the project's root directory.
3. Run the seed script:

```bash
npm run seed
```

### Running Tests

To run the tests for the project, use the following command:

```bash
npm test
```

If you wish to clone your project and run it locally you will need to create environmental variables.



### Environment Variables

To run the project locally, you need to set up two `.env` files: `.env.test` and `.env.development`. Here's how to create them:

1. Create a `.env.test` file with the following content:


```bash
PGDATABASE=test_database_name
```

2. Create a `.env.development` file with the following content:



```bash
PGDATABASE=development_database_name     
```


Replace `test_database_name` and `development_database_name` with the appropriate database names as specified in `/db/setup.sql`. Make sure to also add these `.env` files to your `.gitignore` to avoid committing them to your repository.

### Minimum Requirements

To run the project, you need to have the following installed:

- Node.js (minimum version v21.5.0)
- PostgreSQL (minimum version v8.7.3)


## Main Features

### 1. GET /api/topics
Responds with a list of topics.

### 2. GET /api
Responds with a list of available endpoints.

### 3. GET /api/articles/:article_id
Responds with a single article by article_id.

### 4. GET /api/articles
Responds with a list of articles.

### 5. GET /api/articles/:article_id/comments
Responds with a list of comments by article_id.

### 6. POST /api/articles/:article_id/comments
Adds a comment by article_id.

### 7. PATCH /api/articles/:article_id
Updates an article by article_id.

### 8. DELETE /api/comments/:comment_id
Deletes a comment by comment_id.

### 9. GET /api/users
Responds with a list of users.

### 10. GET /api/articles (queries)
Allows articles to be filtered and sorted.

### 11. GET /api/articles/:article_id (comment count)
Adds a comment count to the response when retrieving a single article.


