const db = require('./db/connection');



selectTopics = async () => {
    try {
        const result = await db.query('SELECT * FROM topics;');
        return result.rows;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = { selectTopics };