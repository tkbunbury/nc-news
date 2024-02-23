# Takai's News API



 **Welcome to NC-News!**


## Overview

This project implements a backend API for accessing application data programmatically. It mimics the functionality of a real-world backend service, providing information to the front-end architecture. The database used is __PostgreSQL__, and interaction with it is done using __node-postgres__.

This project uses __Husky__ to ensure that broken code is not committed. Husky sets up and maintains git hooks, triggering scripts during certain events in the git lifecycle. A pre-commit hook is configured to run tests before each commit. If any tests fail, the commit will be aborted.

## Getting Started

If you wish to clone your project and run it locally you will need to create environmental variables.

You will need to create two __.env files__ for your project: __.env.test__ and __.env.development__. Into each, add __PGDATABASE=__, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are __.gitignored__.

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


