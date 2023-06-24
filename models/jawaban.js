const mongoose = require("mongoose");

const jawabanSchema = new mongoose.Schema({
    namaSiswa: String,
    classId: String,
    userId: String,
    quizId: String,
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
        jawabanUser: String,
        isBenar: Boolean,
        skor: Number,
        isJawab: {
            type: Boolean,
            default: false
        },
        isAnalyzed: Boolean
    }],
    nilai: Number
})

const Jawaban = mongoose.model("Jawaban", jawabanSchema)


exports.Jawaban = Jawaban;
exports.jawabanSchema = jawabanSchema;