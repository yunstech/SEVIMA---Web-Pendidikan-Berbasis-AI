const express = require('express')
const dotenv = require('dotenv')
const app = express();

app.use(express.json())
dotenv.config()

require('./startup/app')(app)
require('./startup/routes')(app)
require('./startup/db')()

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}`))