const express = require("express");
const home = require('../routes/home')
const dashboard = require('../routes/dashboard')
const quiz = require('../routes/quiz')

module.exports = (app) => {
    app.use("/", home);
    app.use("/dashboard", dashboard);
    app.use("/quiz", quiz);


    app.get('*', function (req, res) {
        res.redirect('/')
    });
}