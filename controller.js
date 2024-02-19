const {
    selectTopics,

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

module.exports = { getTopics };