const express = require('express');
const app = express();
const {
    getTopics,
    getEndpoints,
    getArticleById,
    getArticles,
    getCommentsByArticleId,
    postSingleCommentForArticle,
    patchArticleVotes,
    deleteCommentById,
    getUsers,

} = require(`${__dirname}/controller.js`)

app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postSingleCommentForArticle)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.get('/api/users', getUsers)

// app.get('/api/articles', getArticlesByTopic)

app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send({ msg: 'Bad request' });
    }
    else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    if (err.status === 404 || err.code === "23503") {
        res.status(404).send({ msg: 'Not Found' });
        
    }
    else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
})

module.exports = app;