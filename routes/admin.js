const express = require('express')
const router = express.Router();

const winston = require('winston')
const bcrypt = require("bcrypt");

const { User, validate } = require('../models/user')

router.get("/tambah-murid", async (req, res) => {
    res.render('dashboard/tambah-murid', {
        msg: ''
    })
});

router.post("/tambah-murid", async (req, res) => {
    const { error } = validate(req.body)
    console.log("hek", req.body)
    if (error) return res.status(400).render('dashboard/tambah-murid', {
        msg: `<div class="alert alert-danger" role="alert">
            ${error.details[0].message}
        </div>`
    })
    const { nama, email, kelas, kelasId, noAbsen, password, role, foto } = req.body
    let newUser = new User({
        nama: nama,
        email: email,
        kelas: kelas,
        kelasId: kelasId,
        noAbsen: noAbsen,
        foto: foto,
        role: role
    })
    try {

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        newUser.save()
        res.render('dashboard/tambah-murid', {
            msg: `<div class="alert alert-success" role="alert">
            "Murid berhasil ditambahkan."
        </div>`
        })
    } catch (e) {
        res.render('dashboard/tambah-murid', {
            msg: `<div class="alert alert-danger" role="alert">
            ${e.message}
        </div>`
        })
    }
});



module.exports = router;