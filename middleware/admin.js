module.exports = function (req, res, next) {
  if (!req.user.isAdmin) return res.status(403).redirect('/dashboard?valid=' + "Akses ditolak, Hanya admin yang bisa mengaksesnya.") 
  next();
}