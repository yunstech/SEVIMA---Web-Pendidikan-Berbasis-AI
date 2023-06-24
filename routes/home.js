const express = require('express')
const router = express.Router();
const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const users = require('../middleware/user')

router.get("/", async (req, res) => {
    if (req.cookies.token === undefined) {
        res.render('home')
    } else {
        res.redirect("/dashboard")
    }
});

router.get("/login", async (req, res) => {
    if (req.cookies.token === undefined) {
        res.render('login', {
            msg: ''
        })
    } else {
        res.redirect("/dashboard")
    }
});

router.post('/login', async (req, res) => {
    let user = await User.findOne({
        email: req.body.email.toLowerCase()
    })

    if (!user) return res.status(400).render('login', {
        msg: `<div class="alert alert-danger" role="alert">
            Invalid email or password.
        </div>`
    })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).render('login', {
        msg: `<div class="alert alert-danger" role="alert">
            Invalid email or password.
        </div>`
    })

    const token = await user.generateAuthToken(res, req.body.ingat)

    res.redirect('/dashboard')
})

router.get("/logout", [users], function (req, res) {
    res.clearCookie("token");
    res.redirect("/");
});


function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(5).required()
    })
    return schema.validate(req)
}

module.exports = router;