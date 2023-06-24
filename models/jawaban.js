const Joi = require("joi");
const mongoose = require("mongoose");

const jawabanSchema = new mongoose.Schema({
    namaSiswa: String,
    classId: String,
    isSelesai: {
        type: Boolean,
        default: false
    },
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
    dimulai: Date,
    selesai: Date,
    nilai: Number
})

const Jawaban = mongoose.model("Jawaban", jawabanSchema)

const validateData = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
    });
    return schema.validate(data);
};

exports.Quiz = Quiz;
exports.quizSchema = quizSchema;
exports.validate = validateData;