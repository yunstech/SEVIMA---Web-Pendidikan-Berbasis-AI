const express = require('express')
const router = express.Router();


const { Quiz, validateQuiz } = require('../models/quiz')
const { Jawaban } = require('../models/jawaban')

router.get("/:id/:soal", [auth], async (req, res) => {
    const quiz = await Quiz.findOne({ _id: req.params.id })

    soal = quiz.quiz[parseInt(req.params.soal) - 1]
    console.log(soal)
    res.render('quiz', {
        quiz: quiz,
        soal: soal,
        param: parseInt(req.params.soal) + 1
    })
});

router.post('/submit/:quizId/:soalId', [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
})


module.exports = router;