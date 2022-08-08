const jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
  try {
    /* On vérifie que le token JWT est présent dans les cookies de la requête */
    if (!req.cookies.access_token) {
      return res.status(401).json({ message: 'Missing token in cookie' })
    }

    /* On vérifie que le token CSRF est présent dans les en-têtes de la requête */
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Missing CSRF token in headers' })
    }

    const decoded = jwt.verify(req.cookies.access_token, process.env.KEY)
    /* On vérifie que le token CSRF correspond à celui présent dans le token JWT  */
    if (req.headers.authorization !== decoded.user.csrfToken) {
      return res.status(401).json({ message:decoded.user.csrfToken ,ab:req.headers.authorization,cook:req.cookies.access_token })
    }

    /* On appelle le prochain middleware */
  
    return next()
  } catch (err) {
    return res.status(500)
  }
}
