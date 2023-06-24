const express = require('express')
const router = express.Router();

const auth = require("../middleware/auth");

const { User, validate } = require('../models/user')


const { Quiz, validateQuiz } = require('../models/quiz')
const { Jawaban } = require('../models/jawaban')

router.get("/:id", [auth], async (req, res) => {
    const quiz = await Quiz.findOne({ _id: req.params.id })

    res.render('quiz', {
        quiz: quiz
    })
});

router.post('/submit/:quizId', [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });

    const quiz = await Quiz.findOne({ _id: req.params.quizId })
    console.log(quiz)
    let listJawaban = []
    let skor;
    quiz.quiz.forEach((soal, i) => {
        skor = soal.skor
        let jawabanQuiz = {
            quizId: soal.quizId,
            soal: soal.soal,
            jawaban: [...soal.jawaban],
            jawabanBenar: soal.jawabanBenar,
            jawabanUser: req.body[soal.quizId],
            isBenar: req.body[soal.quizId] === soal.jawabanBenar ? true : false,
            skor: soal.skor,
            isJawab: true
        }
        listJawaban.push(jawabanQuiz)
    })
    let benar = listJawaban.filter(c => c.isBenar)
    console.log(benar.length)

    // listJawaban.push(jawabanQuiz)

    // console.log(jawabanQuiz)
    try {

        let newJawaban = new Jawaban({
            namaSiswa: currentUser.nama,
            classId: currentUser.classId,
            userId: currentUser._id,
            quizId: quiz._id,
            isSelesai: true,
            quiz: [...listJawaban],
            nilai: benar.length * skor
        })

        await newJawaban.save()
        res.redirect('/dashboard?msg=' + `<div class="alert alert-success" role="alert">
            Quiz berhasil disubmit.
        </div>`)
    } catch (e) {
        res.redirect('/dashboard?msg=' + `<div class="alert alert-danger" role="alert">
            ${e.message}
        </div>`)
    }
})


router.get('/analisa-hasil/:quizId', [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    const jawaban = await Jawaban.findOne({ quizId: req.params.quizId, userId: currentUser._id })
    if (!jawaban) return res.redirect('/dashboard/list-quiz?msg=' + `<div class="alert alert-warning" role="alert">
            Kamu belum menyelesaikan quiz ini.
        </div>`)

    console.log(jawaban)
})

module.exports = router;