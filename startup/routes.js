const express = require("express");
const home = require('../routes/home')
const dashboard = require('../routes/dashboard')
const quiz = require('../routes/quiz')
const admin = require('../routes/admin')
const chatBot = require('../routes/chat-bot')
const tugas = require('../routes/tugas')

module.exports = (app) => {
    app.use("/", home);
    app.use("/dashboard", dashboard);
    app.use("/quiz", quiz);
    app.use("/admin", admin);
    app.use("/chat-bot", chatBot);
    app.use("/tugas", tugas);


    app.get('*', function (req, res) {
        res.redirect('/')
    });
}