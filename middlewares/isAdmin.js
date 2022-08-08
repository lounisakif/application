module.exports = function (req, res, next) {
  const { cookies } = req
  try {
    if (cookies.role === 'superadmin' ) {
      return next()
    } else {
      return res.status(401)
    }
  } catch (error) {
    return res.status(500)
  }
}
