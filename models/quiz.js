const Joi = require("joi");
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    title: String,
    quiz: [{
        quizId: String,
        soal: String,
        jawaban: [{
            A: String,
            B: String,
            C: String,
            D: String,
            E: String
        }],
        jawabanBenar: String,
        skor: Number,
        isJawab: {
            type: Boolean,
            default: false
        }
    }],
    kelasId: String,
    waktuPengerjaan: Number,
    jumlahSoal: Number,
    isStart: {
        type: Boolean,
        default: false
    }
})

const Quiz = mongoose.model("Quiz", quizSchema)

const validateData = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
    });
    return schema.validate(data);
};

exports.Quiz = Quiz;
exports.quizSchema = quizSchema;
exports.validateQuiz = validateData;