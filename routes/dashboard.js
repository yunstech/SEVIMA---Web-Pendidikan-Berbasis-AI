const express = require('express')
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { Quiz, validateQuiz } = require('../models/quiz')
const { Tugas } = require('../models/tugas')
const { User, validate } = require('../models/user')
const { Notif } = require('../models/notification')

router.get("/", [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    const tugas = await Tugas.find({})
    const notif = await Notif.find({ userId: currentUser._id })
    let belumBaca = notif.filter(c => !c.isRead)
    res.render('dashboard/dashboard', {
        user: currentUser,
        msg: req.query.msg,
        belumBaca: belumBaca.length,
        notif: notif,
        tugas: tugas
    })
});

router.get('/list-quiz', [auth], async (req, res) => {
    const quizzes = await Quiz.find();
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    const notif = await Notif.find({ userId: currentUser._id })
    let belumBaca = notif.filter(c => !c.isRead)
    res.render('dashboard/list-quiz', {
        user: currentUser,
        msg: req.query.msg,
        quizzes: quizzes,
        belumBaca: belumBaca.length,
        notif: notif
    })
})

router.get('/tambah-quiz', [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    const notif = await Notif.find({ userId: currentUser._id })
    let belumBaca = notif.filter(c => !c.isRead)
    res.render('dashboard/tambah-quiz', {
        user: currentUser,
        belumBaca: belumBaca.length,
        notif: notif
    })
})

router.post('/tambah-quiz', [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });

    const parsed = JSON.parse(req.body.soal)
    let soalBank = []


    const { title, kelasId, waktuPengerjaan, jumlahSoal } = req.body
    parsed.forEach(quiz => {
        let soalTemplate = {
            quizId: Math.random() * 10000,
            soal: quiz['soal-quiz'],
            jawaban: [{
                A: quiz.A,
                B: quiz.B,
                C: quiz.C,
                D: quiz.D,
                E: quiz.E
            }],
            jawabanBenar: quiz.jawabanBenar,
            skor: 100 / jumlahSoal,
        }
        soalBank.push(soalTemplate)
    })


    try {

        const newQuiz = new Quiz({
            title: title,
            kelasId: kelasId,
            waktuPengerjaan: waktuPengerjaan,
            jumlahSoal: jumlahSoal,
            quiz: [...soalBank]
        })

        await newQuiz.save()
        res.redirect('/dashboard/list-quiz?msg=' + `<div class="alert alert-success" role="alert">
            Quiz berhasil ditambahkan.
        </div>`)
    } catch (e) {
        res.redirect('/dashboard/list-quiz?msg=' + `<div class="alert alert-danger" role="alert">
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