const {
    selectTopics,
    readEndpointsFile,
    selectArticleById,

} = require(`${__dirname}/model.js`)


async function getTopics (req, res, next) {
    try{
        const topics = await selectTopics();
        res.status(200).send({ topics })
    }
    catch (err) {
        next(err)
    }
}

async function getEndpoints (req, res, next) {
    try{
        const endpoints = await readEndpointsFile();
        res.status(200).send( endpoints )
    }
    catch (err) {
        next(err)
    }
}

async function getArticleById (req, res, next) {
    try{
        const { article_id } = req.params;
        const article = await selectArticleById(article_id);
        res.status(200).send( { article } )
    }
    catch (err) {
        next(err)
    }
}

module.exports = { getTopics, getEndpoints, getArticleById };