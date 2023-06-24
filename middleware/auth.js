const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {
    const token = req.cookies.token || '';
    if (!token) return res.status(403).render('home', {
        msg: `<div class="alert alert-warning" style='font-size: 12px; color: red;' role="alert">
            "akses ditolak. hanya user terdaftar yang bisa mengaksesnya"
          </div>`
    })

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        req.user = decoded
        next()
    } catch (ex) {
        res.status(400).send("Invalid token.")
    }
}