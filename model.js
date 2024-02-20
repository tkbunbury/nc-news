const db = require('./db/connection');
const fs = require('fs/promises');


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

module.exports = { selectTopics, readEndpointsFile, selectArticleById };