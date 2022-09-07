const knex = require('../db/knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const randtoken = require('rand-token')
const jwtSecret = process.env.KEY
// liste des users
const listusers = async (req, res) => {
    try {

      console.log('ok')
      const users = await knex.select().from('utilisateur').whereNot('role', 'adminn')
      return res.status(200).send(users)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('erreur serveur')
    }
  }

  // login
const login = async (req, res) => {
    try {
      const { email, password } = req.body
      console.log("req.body")
      const user = await knex.select().from('utilisateur').where('login', email).then((user) => { return user[0] }) // chercher l'utilisateur dans la base de données
      if (!user) {
        // si le user n'existe pas dans la base de données
        return res.status(400).json({ msg: "user n'existe pas" })
      }
  
      const isMatch = await bcrypt.compare(password, user.password) // hasher le password inserer dans la base de données et le comparer a celui de la base de données
      console.log(user.password)
      if (!isMatch) {
        // si le password est incorrect
        return res.status(400).json({ msg: "informations d'identification invalides" })
      }
  
      const csrfToken = randtoken.generate(20)
      // grenerer un token jwt
    const id =user.id
    const adresse =user.adresse
      const payload = { // ce qui sera renvoyé (id user) si le token est correct lors de la verification
        user: {
          csrfToken,
          id,
       
        }
      }
  
      const token = jwt.sign(
        payload,
        jwtSecret, { expiresIn: '2d' }
  
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
  console.log('ok')
      res.json({
        id: user.id,
        role: user.role,
        csrf: csrfToken,
        adresse:user.adresse
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('erreur serveur')
    }
  }

  // supprimer un user
const removeUser = async (req, res) => { 
    try {
        console.log(req.params.id)
      const user = await knex.select().from('utilisateur').where('id', req.params.id).then((user) => { return user[0] })
      if (user) {
        knex('utilisateur').where('id', req.params.id)
          .del().then(function () {
            res.json({ msg: 'Utilisateur supprimé!' })
          })
      } else {
        res.status(400)
        return res.send("user n'existe pas")
      }
    } catch (err) {
      console.error(err.message)
      res.status(500).send('erreur serveur')
    }
  }
  // ajouter un nouvel user
const addUser = async (req, res) => {
    try {
      
      const { email, nom, prenom, password, role, adresse } = req.body
      const emailExists = await knex.select().from('utilisateur').where('login', email).then((user) => { return user[0] })// verifier si l'email existe deja
      if (!emailExists) { // si l email n'existe pas dans la base de données alors inserer un nouveau user
        const newUser = { email, nom, prenom, password, role, adresse}
        const salt = await bcrypt.genSalt(10) // generer une chaîne aléatoire de 10 caracteres
        newUser.password = await bcrypt.hash(password, salt) // hasher le password
        await knex('utilisateur').insert([{
          login: newUser.email,
          nom: newUser.nom,
          prenom: newUser.prenom,
          password: newUser.password,
          role: newUser.role,
          adresse: newUser.adresse,
          
          
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



  module.exports = {listusers,login,addUser,removeUser}