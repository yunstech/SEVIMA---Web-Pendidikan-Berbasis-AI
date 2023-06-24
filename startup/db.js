const mongoose = require('mongoose')
const winston = require('winston')

module.exports = function () {
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => winston.info("Connected to mongodb..."))
}