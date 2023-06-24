const express = require('express')
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai')

const auth = require("../middleware/auth");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    basePath: "https://api.pawan.krd/v1",
});

const openai = new OpenAIApi(configuration);


router.get('/', async (req, res) => {

    res.status(200).render('eduai-chat', {
        message: 'Selamat datang di EduAI chat bot!'
    })
})

router.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        console.log(prompt)


        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `${prompt}` }]
        })
        if (!response.data.choices) {
            res.status(200).send({
                bot: "Server Down"
            });
        } else {
            res.status(200).send({
                bot: response.data.choices[0].message.content
            });
        }

    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
})


module.exports = router;