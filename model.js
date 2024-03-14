const db = require('./db/connection');
const fs = require('fs/promises');
const { articleData, commentData, topicData, userData } = require(`${__dirname}/db/data/test-data/index.js`);


selectTopics = async () => {

        const result = await db.query('SELECT * FROM topics;');
        return result.rows;
}

readEndpointsFile = async () => {
    
        const endpointFilePending = await fs.readFile(`${__dirname}/endpoints.json`, 'utf-8');
        const parsedFile = JSON.parse(endpointFilePending);
        return parsedFile;
}

selectArticleById = async (article_id) => {
    const result = await db.query('SELECT articles.*, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url;', [article_id])
    const article = result.rows[0]
    if (!article) {
        return Promise.reject({
            status: 404,
        })
    }
    const articleWithString = { ...article, created_at: new Date(article.created_at).toISOString() };
    return articleWithString;
}

selectArticles = async (topic = {}) => {

    let result;
    const topics = await selectTopics()
    const validTopics = topics.map(topic => topic.slug);

    let queryString = 'SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id'

    if (typeof topic === 'string' && topic.trim() !== '') {

        if (!validTopics.includes(topic)) {
            return Promise.reject({
                status: 404,
            })
        }
        else {
            queryString += ' WHERE topic = $1 GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url'
            result = await db.query(queryString, [topic])
        }        
    }
    else {
        queryString += ' GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url'
        result = await db.query(queryString);
    }
    const articles = result.rows;
    const sortedArticles = [...articles];
    sortedArticles.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    return sortedArticles;
}

selectCommentsByArticleId = async (article_id) => {
    const result = await db.query('SELECT * FROM comments WHERE article_id = $1;', [article_id])
    const comments = result.rows
    const sortedComments = [...comments]
    sortedComments.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    return sortedComments
}

postNewCommentForArticle = async (article_id, dataObject) => {

const result = await db.query('INSERT INTO comments (author, body, article_id, votes) VALUES ($1, $2, $3, $4) RETURNING *', [dataObject.username, dataObject.body, article_id, 0] )
return result.rows[0]
}

updateArticleVotes = async (article_id, dataObject) => {

    const result = await db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [dataObject.inc_votes, article_id] )

    if (!result.rows[0]) {
        return Promise.reject({
            status: 404,
            msg: `NO article found for article_id: ${article_id}`
        })
    }
    return result.rows[0]
    }

removeCommentById = async (comment_id) => {
    const result = await db.query('SELECT * FROM comments WHERE comment_id = $1;', [comment_id]);
    
    if (!result.rows[0]) {
        return Promise.reject({
            status: 404,
            msg: `NO comment found for comment_id: ${comment_id}`
        })
    }
    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id]);
    };

selectUsers = async () => {
    const result = await db.query('SELECT * FROM users;');
    return result.rows;
}

module.exports = { selectTopics, readEndpointsFile, selectArticleById, selectArticles, selectCommentsByArticleId, postNewCommentForArticle, updateArticleVotes, removeCommentById, selectUsers }