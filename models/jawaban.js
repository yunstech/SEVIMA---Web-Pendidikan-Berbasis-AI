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


exports.Quiz = Quiz;
exports.quizSchema = quizSchema;