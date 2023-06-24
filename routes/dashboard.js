const express = require('express')
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { Quiz, validateQuiz } = require('../models/quiz')
const { User, validate } = require('../models/user')

router.get("/", [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });

    res.render('dashboard/dashboard', {
        user: currentUser,
        msg: req.query.msg
    })
});

router.get('/list-quiz', [auth], async (req, res) => {
    const quizzes = await Quiz.find();
    const currentUser = await User.findOne({
        _id: req.user._id,
    });

    console.log(currentUser)
    res.render('dashboard/list-quiz', {
        user: currentUser,
        msg: req.query.msg,
        quizzes: quizzes
    })
})

router.get('/tambah-quiz', [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    res.render('dashboard/tambah-quiz', {
        user: currentUser
    })
})

router.post('/tambah-quiz', [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });

    const parsed = JSON.parse(req.body.soal)
    console.log(parsed)
    let soalBank = []


    const { title, kelasId, waktuPengerjaan, jumlahSoal } = req.body
    parsed.forEach(quiz => {
        console.log(quiz)
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

    console.log(soalBank)

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

router.get('/edit-quiz', [auth], async (req, res) => {

})


module.exports = router;