const mongoose = require("mongoose");

const analyzeSchema = new mongoose.Schema({
    content: String,
    quizId: String,
    soalId: String
})

const Analyze = mongoose.model("Analyze", analyzeSchema)

// const validateData = (data) => {
//     const schema = Joi.object({
//         title: Joi.string().min(5).required(),
//     });
//     return schema.validate(data);
// };

exports.Analyze = Analyze;
exports.analyzeSchema = analyzeSchema;
// exports.validateQuiz = validateData;