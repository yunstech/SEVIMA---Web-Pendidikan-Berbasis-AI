const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const express = require('express')

module.exports = (app) => {
    app.use(bodyParser.json({
        limit: "50mb",
        extended: true
    }));
    app.use(bodyParser.urlencoded({
        limit: "50mb",
        extended: true
    }));
    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(cookieParser());
}