const express = require('express')
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


const { User, validate } = require('../models/user')

router.get("/", [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });

    res.render('dashboard/dashboard', {
        user: currentUser
    })
});



module.exports = router;