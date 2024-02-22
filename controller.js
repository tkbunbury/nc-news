const {
    selectTopics,
    readEndpointsFile,
    selectArticleById,
    selectArticles,
    selectCommentsByArticleId,
    postNewCommentForArticle,
    updateArticleVotes,
    removeCommentById,
    selectUsers,

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
            return Promise.reject({status: 200, msg: "No comments found"})
        }
        else {
            const sortedArray = resolutions[0]
            res.status(200).send( sortedArray )
        }

    }).catch((err) => {
        next(err)
    })
}

async function postSingleCommentForArticle (req, res, next) {
    try{
        const { article_id } = req.params;
        const  dataObject  = req.body;
        const comment = await postNewCommentForArticle(article_id, dataObject);
        res.status(201).send( {comment} )
    }
    catch (err) {
        next(err)
    }
}

async function patchArticleVotes (req, res, next) {
    try{
        const { article_id } = req.params;
        const  dataObject  = req.body;
        const updatedArticle = await updateArticleVotes(article_id, dataObject);
        res.status(200).send( {updatedArticle} )
    }
    catch (err) {
        next(err)
    }
}


async function deleteCommentById (req, res, next) {
    try{
        const { comment_id } = req.params;
        const deletedComment = await removeCommentById(comment_id);
        res.status(204).send();
    }
    catch (err) {
        next(err)
    }
};


async function getUsers (req, res, next) {
    try{
        const users = await selectUsers();
        res.status(200).send({ users })
    }
    catch (err) {
        next(err)
    }
}


module.exports = { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postSingleCommentForArticle, patchArticleVotes, deleteCommentById, getUsers };