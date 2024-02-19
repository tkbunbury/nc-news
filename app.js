const express = require('express');
const app = express();
const {
    getTopics,
    getEndpoints,

} = require(`${__dirname}/controller.js`)

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.use((req, res, next) => {
    res.status(404).json({ msg: 'Route not found' });
});

module.exports = app;