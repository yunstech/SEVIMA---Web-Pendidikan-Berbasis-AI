const express = require('express')
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { Quiz, validateQuiz } = require('../models/quiz')
const { User, validate } = require('../models/user')
const { Tugas } = require('../models/tugas')
const { Notif } = require('../models/notification')
const multer = require('multer')
const fs = require('fs')
const path = require("path");

function encode(url) {
    const base64Img = require('base64-img')
    let data = base64Img.base64Sync(url)
    return data
}


const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './')
        },
        filename: (req, file, cb) => {
            req.fileIdentifier = Date.now() + path.extname(file.originalname);
            cb(null, req.fileIdentifier)
        }
    })
})





router.get("/:tugasId", [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });

    const notif = await Notif.find({ userId: currentUser._id })
    let belumBaca = notif.filter(c => !c.isRead)
    const tugas = await Tugas.findOne({ _id: req.params.tugasId })
    res.render('dashboard/tugas', {
        tugas: tugas,
        user: currentUser,
        belumBaca: belumBaca.length,
        notif: notif
    })
});

router.post('/upload-tugas/:quizId', upload.single('foto'), [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    const tugas = await Tugas.findOne({ _id: req.params.quizId })
    let dataTugas = [...tugas.uploadTugas]
    let imageLocation = req.fileIdentifier
    if (imageLocation !== undefined) {
        req.body.foto = encode(imageLocation);
        fs.unlinkSync(imageLocation)
    }
    try {

        const newTugas = {
            nama: currentUser.nama,
            userId: currentUser._id,
            image: req.body.foto
        }
        dataTugas.push(newTugas)
        console.log(dataTugas)
        await Tugas.findOneAndUpdate({ _id: req.params.quizId }, {
            uploadTugas: dataTugas
        })

        res.redirect(`/tugas/${req.params.quizId}?msg=` + `<div class="alert alert-success" role="alert">
        Tugas berhasil diupload.
        </div>`)
    } catch (e) {
        res.redirect(`/tugas/${req.params.quizId}?msg=` + `<div class="alert alert-danger" role="alert">
        ${e.message}.
        </div>`)
    }
})


router.post('/tambah-tugas', upload.single('foto'), [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    let imageLocation = req.fileIdentifier
    if (imageLocation !== undefined) {
        req.body.foto = encode(imageLocation);
        fs.unlinkSync(imageLocation)
    }

    const { content, foto } = req.body

    try {

        const newTugas = new Tugas({
            nama: currentUser.nama,
            userId: currentUser._id,
            content: content,
            foto: foto
        })

        await newTugas.save()
        res.redirect('/dashboard?msg=' + `<div class="alert alert-success" role="alert">
            Tugas berhasil ditambahkan.
        </div>`)
    } catch (e) {
        res.redirect('/dashboard?msg=' + `<div class="alert alert-danger" role="alert">
            ${e.message}
        </div>`)
    }
})

router.get('/hapus-quiz/:quizId', [auth], async (req, res) => {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.quizId })
    console.log(quiz)
    if (!quiz) return res.redirect('/dashboard/list-quiz?msg=' + `<div class="alert alert-danger" role="alert">
            Quiz Tidak Ditemukan.
        </div>`)
    res.redirect('/dashboard/list-quiz?msg=' + `<div class="alert alert-success" role="alert">
            Quiz Berhasil Dihapus.
        </div>`)
})

module.exports = router;