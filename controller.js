const {
    selectTopics,
    readEndpointsFile,
    selectArticleById,
    selectArticles,
    selectCommentsByArticleId,

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

async function getArticles (req, res, next) {
    try{
        const articles = await selectArticles();
        res.status(200).send({ articles })
    }
    catch (err) {
        next(err)
    }
}

async function getCommentsByArticleId (req, res, next) {
    const { article_id } = req.params;
    const promises = [
        selectCommentsByArticleId(article_id),
        selectArticleById(article_id)
    ]
    Promise.all(promises).then((resolutions) => {
        if (resolutions[0].length === 0) {
            return Promise.reject({status: 404, msg: "No comments found"})
        }
        else {
            const sortedArray = resolutions[0]
            res.status(200).send( sortedArray )
        }

    }).catch((err) => {
        next(err)
    })
}

module.exports = { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId };