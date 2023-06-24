const mongoose = require("mongoose");

const tugasSchema = new mongoose.Schema({
    nama: String,
    userId: String,
    content: String,
    foto: String,
    uploadTugas: [{
        nama: String,
        userId: String,
        image: String
    }]
})

const Tugas = mongoose.model("Tugas", tugasSchema)

// const validateData = (data) => {
//     const schema = Joi.object({
//         title: Joi.string().min(5).required(),
//     });
//     return schema.validate(data);
// };

exports.Tugas = Tugas;
exports.tugasSchema = tugasSchema;
// exports.validateQuiz = validateData;