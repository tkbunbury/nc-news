const db = require('./db/connection');
const fs = require('fs/promises');
const articles = require('./db/data/test-data/articles');


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
    const result = await db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    const article = result.rows[0]
    if (!article) {
        return Promise.reject({
            status: 404,
            msg: `NO article found for article_id: ${article_id}`
        })
    }
    const articleWithString = { ...article, created_at: new Date(article.created_at).toISOString() };
    return articleWithString;
}

selectArticles = async () => {

    const result = await db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url ;')
    
    const articles = result.rows;
    const sortedArticles = [...articles];
    sortedArticles.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    return sortedArticles;
}

module.exports = { selectTopics, readEndpointsFile, selectArticleById, selectArticles };