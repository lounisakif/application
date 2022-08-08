
const knex = require('../db/knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const randtoken = require('rand-token')
const jwtSecret = process.env.KEY
const mail = require('./fonctions/sendmail')

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await knex.select().from('users').where('email', email).then((user) => { return user[0] }) // chercher l'utilisateur dans la base de données
    if (!user) {
      // si le user n'existe pas dans la base de données
      return res.status(400).json({ msg: "user n'existe pas" })
    }

    const isMatch = await bcrypt.compare(password, user.password) // hasher le password inserer dans la base de données et le comparer a celui de la base de données

    if (!isMatch) {
      // si le password est incorrect
      return res.status(400).json({ msg: "informations d'identification invalides" })
    }

    const csrfToken = randtoken.generate(20)
    // grenerer un token jwt
  const id =user.id
    const payload = { // ce qui sera renvoyé (id user) si le token est correct lors de la verification
      user: {
        csrfToken,
        id
      }
    }

    const token = jwt.sign(
      payload,
      jwtSecret, 
      { expiresIn: '2d' }

    )
    res.cookie('access_token', token, {
      expires: new Date(Date.now() + 100000000),
      secure: false, // set to true if your using https
      httpOnly: true,

    }).cookie('role', user.role, {
      expires: new Date(Date.now() + 100000000),
      secure: false, // set to true if your using https
      httpOnly: true,
    })

    /* On envoie une reponse JSON contenant le role de l'utilisateur et le token CSRF */

    res.json({
      id:user.id,
      role: user.role,
      csrf: csrfToken
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('erreur serveur')
  }
}
/*****************************************************************************************************************/
// register

const sendemail = (email) => { // envoyer un email de confirmation
  const code = randtoken.generate(8)// generer une chaine aleatoire
  const subject = 'Confirmez votre compte'
  const contenu = '<h1>votre code de confirmation est</h1><p> ' + code
  mail.send(email, subject, contenu)
  return code
}

// Route: /registerB2B
const registerB2B = async (req, res) => {
  try {
    const { email, siret, nomEntreprise, password } = req.body
    const emailExists = await knex.select().from('users').where('email', email).then((user) => { return user[0] })// verifier si l'email existe deja
    if (!emailExists) { // si l email n'existe pas dans la base de données alors inserer un nouveau user
      // const code = await sendemail(email)// envoyer un email de confirmation pour l'utilisateur
      const code='b2b'
      const newUser = { email, siret, nomEntreprise, password, code }
      const salt = await bcrypt.genSalt(10) // generer une chaîne aléatoire de 10 caracteres
      newUser.password = await bcrypt.hash(password, salt) // hasher le password
      await knex('users').insert([{
        email: newUser.email,
        SIRET: newUser.siret,
        nom_entreprise: newUser.nomEntreprise,
        password: newUser.password,
        role: 'B2B',
        code: newUser.code,
        valid: 'false'
      }])
      
      res.status(200).send({ msg: 'ajouté avec succès' })
    } else {
      res.status(400).send({ msg: 'utilisateur deja inscrit' }) // Condition if user is already in the database
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('erreur serveur')
  }
}

// Route: /registerB2C
const registerB2C = async (req, res) => {
  try {
    const { email, nom, prenom, password } = req.body
    const emailExists = await knex.select().from('users').where('email', email).then((user) => { return user[0] })// verifier si l'email existe deja
    if (!emailExists) { // si l email n'existe pas dans la base de données alors inserer un nouveau user
      // const code = await sendemail(email)// envoyer un email de confirmation pour l'utilisateur
      const code='b2c'
      const newUser = { email, nom, prenom, password, code }
      const salt = await bcrypt.genSalt(10) // generer une chaîne aléatoire de 10 caracteres
      newUser.password = await bcrypt.hash(password, salt) // hasher le password
      await knex('users').insert([{
        email: newUser.email,
        nom: newUser.nom,
        prenom: newUser.prenom,
        password: newUser.password,
        role: 'B2C',
        code: newUser.code
      }])
      res.status(200).send({ msg: 'ajouté avec succès' })
    } else {
      res.status(400).send({ msg: 'utilisateur deja inscrit' }) // Condition if user is already in the database
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('erreur serveur')
  }
}
/** ****************************************************************************************************************** */
// confirmer l'inscription
const confirmInscription = async (req, res) => {
  try {
    const code = req.body.code
    const email = req.body.email
    const user = await knex.select().from('users').where('email', email).then((user) => { return user[0] })

    if (code === user.code) {
      res.status(200).send('compte confirmé')
    } else {
      res.status(400).send('code incorrect')
    }
  } catch (error) {
    res.status(500).send('erreur serveur')
  }
}
/** ***************************************************************************************************************** */
// forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    // verfier si l'user existe dans la BD
    const user = await knex.select().from('users').where('email', email).then((user) => { return user[0] })
    if (!user) {
      res.status(404).json({ error: 'email invalid' })
    } else {
      const code = randtoken.generate(8)// generer une chaine aleatoire
      const subject = 'confirme password'
      const contenu = '<h1>votre code de confirmation est</h1><p> ' + code
      await mail.send(email, subject, contenu)
      await knex('users').where('email', req.body.email)
        .update({ code }).then(res.status(200).send('mot de passe oublié'))
    }
  } catch (error) {
    res.status(500).send('erreur serveur')
  }
}
/** ***************************************************************************************************************** */
// reset password
const resetPassword = async (req, res) => {
  try {
    const code = req.body.code
    const email = req.body.email
    let password = req.body.password
    const user = await knex.select().from('users').where('email', email).then((user) => { return user[0] })
    if (code === user.code) {
      const salt = await bcrypt.genSalt(10) // generer une chaîne aléatoire de 10 caracteres
      password = await bcrypt.hash(password, salt) // hasher le password
      await knex('users').where('email', req.body.email).update({ password }).then(res.status(200).send('mot de passe reinisialiser'))
    } else {
      res.status(400).send('code incorrect')
    }
  } catch (error) {
    res.status(500).send('erreur serveur')
  }
}
const logout = async (req, res) => {
  res.clearCookie('access_token').clearCookie('role')
  res.send()
}
module.exports = { login, registerB2B, registerB2C, confirmInscription, forgotPassword, resetPassword, logout }
