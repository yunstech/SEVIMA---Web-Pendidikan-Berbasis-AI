const express = require('express')
const router = express.Router();

const winston = require('winston')
const bcrypt = require("bcrypt");


const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { User, validate } = require('../models/user')

router.get("/tambah-user", [auth, admin], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    res.render('dashboard/tambah-user', {
        msg: '',
        user: currentUser
    })
});

router.post("/tambah-user", [auth, admin], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    const { error } = validate(req.body)
    if (error) return res.status(400).render('dashboard/tambah-user', {
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
        res.render('dashboard/tambah-user', {
            msg: `<div class="alert alert-success" role="alert">
            "Murid berhasil ditambahkan."
        </div>`,
            user: currentUser
        })
    } catch (e) {
        res.render('dashboard/tambah-user', {
            msg: `<div class="alert alert-danger" role="alert">
            ${e.message}
        </div>`,
            user: currentUser
        })
    }
});

router.get('/list-user', [auth, admin], async (req, res) => {
    const users = await User.find().sort('nama');
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    res.render("dashboard/list-user", {
        list: users,
        user: currentUser,
        msg: req.query.msg
    });
})

router.get('/edit-user/:id', [auth, admin], async (req, res) => {
    const user = await User.findOne({
        _id: req.params.id
    }).sort('nama');
    const currentUser = await User.findOne({
        _id: req.user._id,
    });


    res.render('dashboard/edit-user', {
        siswa: user,
        user: currentUser
    })
})


router.post('/edit-user/:id', [auth, admin], async (req, res) => {
    const { nama, email, kelas, kelasId, noAbsen, password, role, foto, isAdmin } = req.body
    let updateUser = {
        nama: nama,
        email: email,
        kelas: kelas,
        kelasId: kelasId,
        noAbsen: noAbsen,
        foto: foto,
        role: role,
        isAdmin: Boolean(isAdmin)
    }
    if (password) {
        const salt = await bcrypt.genSalt(10);
        updateUser.password = await bcrypt.hash(password, salt);
    }
    try {
        const siswa = await User.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            updateUser
        );
        res.redirect('/admin/list-user?msg=' + `<div class="alert alert-success" role="alert">
            "Murid berhasil diedit."
        </div>`)
    } catch (e) {
        res.redirect('/admin/list-user?msg=' + `<div class="alert alert-danger" role="alert">
            ${e.message}
        </div>`)
    }
})

router.get("/hapus-user/:id", [auth, admin], async (req, res) => {
    try {

        await User.deleteOne({
            _id: req.params.id,
        });

        res.redirect('/admin/list-user?msg=' + `<div class="alert alert-success" role="alert">
    "Murid berhasil dihapus."
    </div>`)
    } catch (e) {
        res.redirect('/admin/list-user?msg=' + `<div class="alert alert-danger" role="alert">
            ${e.message}
        </div>`)
    }
});


module.exports = router;