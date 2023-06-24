const mongoose = require("mongoose");

const notifSchema = new mongoose.Schema({
    content: String,
    judul: String,
    quizId: String,
    isRead: Boolean,
    userId: String,
})

const Notif = mongoose.model("Notif", notifSchema)

// const validateData = (data) => {
//     const schema = Joi.object({
//         title: Joi.string().min(5).required(),
//     });
//     return schema.validate(data);
// };

exports.Notif = Notif;
exports.notifSchema = notifSchema;
// exports.validateQuiz = validateData;