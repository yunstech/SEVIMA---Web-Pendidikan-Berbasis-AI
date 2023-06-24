const express = require('express')
const router = express.Router();

const auth = require("../middleware/auth");

const { Analyze } = require('../models/analyze')
const { User, validate } = require('../models/user')

const { Quiz, validateQuiz } = require('../models/quiz')
const { Jawaban } = require('../models/jawaban')
const { Configuration, OpenAIApi } = require('openai')

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
    let salah = jawaban.quiz.filter(c => !c.isBenar)
    let hasilAnalisa = await analyzeCall(req, currentUser)
    console.log(hasilAnalisa)
    res.render('dashboard/analisis-quiz', {
        user: currentUser,
        quiz: jawaban,
        salah: salah,
        analisa: hasilAnalisa
    })


})


async function operation(req, currentUser) {
    return new Promise(async function (resolve, reject) {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
            basePath: "https://api.pawan.krd/v1",
        });

        const openai = new OpenAIApi(configuration);

        const jawaban = await Jawaban.findOne({ quizId: req.params.quizId, userId: currentUser._id })
        if (!jawaban) return res.redirect('/dashboard/list-quiz?msg=' + `<div class="alert alert-warning" role="alert">
            Kamu belum menyelesaikan quiz ini.
        </div>`)
        let salah = jawaban.quiz.filter(c => !c.isBenar)
        let hasilAnalisa = []
        for (let soal of salah) {
            const analyzeData = await Analyze.findOne({
                quizId: jawaban.quizId,
                soalId: soal.quizId
            })
            if (!analyzeData || analyzeData === null) {


                openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "system", content: `${soal.soal} jelaskan dengan padat dan jelas` }]
                }).then(async res => {

                    try {

                        if (!res.data.choices) {
                            console.log("Maybe Server Down")
                        } else {
                            let datas = {
                                content: await res.data.choices[0].message.content,
                                quizId: jawaban.quizId,
                                soalId: soal.quizId
                            }
                            hasilAnalisa.push(datas)


                            const newAnalyze = new Analyze(datas)
                            await newAnalyze.save()
                        }

                    } catch (e) {
                        console.log(e.message)
                    }
                })

            } else {
                hasilAnalisa.push(analyzeData)
            }
        }

        // may be a heavy db call or http request?
        resolve(hasilAnalisa) // successfully fill promise
    })
}

async function analyzeCall(req, currentUser) {
    return await operation(req, currentUser)
}



module.exports = router;