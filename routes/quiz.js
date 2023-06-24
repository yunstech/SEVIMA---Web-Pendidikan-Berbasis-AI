const express = require('express')
const router = express.Router();
const auth = require("../middleware/auth");
const { Analyze } = require('../models/analyze')
const { Notif } = require('../models/notification')
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
    let salah = listJawaban.filter(c => !c.isBenar)
    if (salah) {
        const newNotif = new Notif({
            content: `Total ada ${salah.length} soal, yang kamu tidak mengerti, segera pelajari lebih lanjut disini.`,
            judul: `Ayo Perbaiki Nilai ${quiz.title} mu.`,
            quizId: req.params.quizId,
            isRead: false,
            userId: currentUser._id
        })

        await newNotif.save()
    }

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
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        basePath: "https://api.pawan.krd/v1",
    });

    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    const notif = await Notif.find({ userId: currentUser._id })
    let belumBaca = notif.filter(c => !c.isRead)
    const openai = new OpenAIApi(configuration);
    await Notif.findOneAndUpdate({ quizId: req.params.quizId }, {
        isRead: true
    })
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

            try {
                await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "system", content: `${soal.soal} jelaskan dengan padat dan jelas` }]
                }).then(async response => {



                    if (!response.data.choices) {
                        console.log("AI Server Down")
                        return res.send("AI Server Down")
                    } else {
                        let datas = {
                            content: await response.data.choices[0].message.content,
                            quizId: jawaban.quizId,
                            soalId: soal.quizId
                        }
                        hasilAnalisa.push(datas)


                        const newAnalyze = new Analyze(datas)
                        await newAnalyze.save()
                    }


                })
            } catch (e) {
                console.log(e.message)
            }
        } else {
            hasilAnalisa.push(analyzeData)
        }
    }
    console.log(hasilAnalisa)
    res.render('dashboard/analisis-quiz', {
        user: currentUser,
        quiz: jawaban,
        salah: salah,
        analisa: hasilAnalisa,
        belumBaca: belumBaca.length,
        notif: notif
    })


})

router.get('/analisa-hasil-guru/:quizId/:userId', [auth], async (req, res) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        basePath: "https://api.pawan.krd/v1",
    });

    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    const notif = await Notif.find({ userId: currentUser._id })
    let belumBaca = notif.filter(c => !c.isRead)
    const openai = new OpenAIApi(configuration);
    await Notif.findOneAndUpdate({ quizId: req.params.quizId }, {
        isRead: true
    })
    const jawaban = await Jawaban.findOne({ quizId: req.params.quizId, userId: req.params.userId })
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

            try {
                await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "system", content: `${soal.soal} jelaskan dengan padat dan jelas` }]
                }).then(async response => {



                    if (!response.data.choices) {
                        console.log("AI Server Down")
                        return res.send("AI Server Down")
                    } else {
                        let datas = {
                            content: await response.data.choices[0].message.content,
                            quizId: jawaban.quizId,
                            soalId: soal.quizId
                        }
                        hasilAnalisa.push(datas)


                        const newAnalyze = new Analyze(datas)
                        await newAnalyze.save()
                    }


                })
            } catch (e) {
                console.log(e.message)
            }
        } else {
            hasilAnalisa.push(analyzeData)
        }
    }
    console.log(jawaban)
    res.render('dashboard/analisis-quiz', {
        user: currentUser,
        quiz: jawaban,
        salah: salah,
        analisa: hasilAnalisa,
        belumBaca: belumBaca.length,
        notif: notif
    })


})

router.get('/lihat-hasil/:quizId', [auth], async (req, res) => {
    const currentUser = await User.findOne({
        _id: req.user._id,
    });
    const notif = await Notif.find({ userId: currentUser._id })
    let belumBaca = notif.filter(c => !c.isRead)
    const hasil = await Jawaban.find({ quizId: req.params.quizId })
    res.render('dashboard/hasil-quiz', {
        user: currentUser,
        belumBaca: belumBaca.length,
        notif: notif,
        quiz: hasil,
        msg: req.query.msg
    })
})




module.exports = router;