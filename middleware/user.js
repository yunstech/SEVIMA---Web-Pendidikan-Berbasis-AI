const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {
    const token = req.cookies.token || '';
    if (!token || token == '') {
        req.user = false
        return next()
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        req.user = decoded
        next()
    } catch (ex) {
        res.status(400).send("Invalid token.")
    }
}