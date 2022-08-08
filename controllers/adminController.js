const knex = require('../db/knex')
const bcrypt = require('bcrypt')

// ajouter un nouvel admin
const addAdmin = async (req, res) => {
  try {
    const thisDate= new Date()
    thisDate.setDate(thisDate.getDate())
   
    let  datee = (thisDate.getUTCDate())+ "/" + (thisDate.getMonth() + 1)+ "/" + (thisDate.getUTCFullYear()) ;

    const { email, nom, prenom, password } = req.body
    const emailExists = await knex.select().from('users').where('email', email).then((user) => { return user[0] })// verifier si l'email existe deja
    if (!emailExists) { // si l email n'existe pas dans la base de données alors inserer un nouveau user
      const newUser = { email, nom, prenom, password }
      const salt = await bcrypt.genSalt(10) // generer une chaîne aléatoire de 10 caracteres
      newUser.password = await bcrypt.hash(password, salt) // hasher le password
      await knex('users').insert([{
        email: newUser.email,
        nom: newUser.nom,
        prenom: newUser.prenom,
        password: newUser.password,
        role: 'admin',
        created_at: datee
        
        
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
/** ********************************************************************************************************************** */
// supprimer un admin
const removeUser = async (req, res) => { // supprimer soit un admin soit une demmande d'inscription b2b
  try {
    const user = await knex.select().from('users').where('id', req.params.id).then((user) => { return user[0] })
    if (user) {
      knex('users').where('id', req.params.id)
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
/** ************************************************************************************************ */
// valider la demande d'inscription B2B
const validerB2B = async (req, res) => {
  try {
    const user = await knex.select().from('users').where('id', req.body.id).then((user) => { return user[0] })
    if (user) {
      await knex('users').where('id', req.body.id)
        .update({ valid: 'true' }).then(res.status(200).send('validé'))
    } else {
      res.status(400)
      return res.send("user n'existe pas")
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('erreur serveur')
  }
}
// liste des Admins
const listAdmin = async (req, res) => {
  try {
    const admins = await knex.select().from('users').where('role', 'admin')
    return res.status(200).send(admins)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('erreur serveur')
  }
}
//liste demande b2b non validée
const listB2B = async (req, res) => {
  try {
    const b2b = await knex.select().from('users').where('role', 'B2B').where('valid', false)
    return res.status(200).send(b2b)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('erreur serveur')
  }
}
//liste demande b2b validée
const listB2BValid = async (req, res) => {
  try {
    const b2b = await knex.select().from('users').where('role', 'B2B').where('valid',true)
    return res.status(200).send(b2b)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('erreur serveur')
  }
}
//liste clients B2C
const listB2C = async (req, res) => {
  try {
    const b2c = await knex.select().from('users').where('role', 'B2C')
    return res.status(200).send(b2c)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('erreur serveur')
  }
}
//liste clients
const getClient = async (req, res) => {
  try {
    const client = await knex.select().from('users').where('id',req.params.id)
    return res.status(200).send(client)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('erreur serveur')
  }
}



module.exports = { addAdmin, removeUser, validerB2B, listAdmin,listB2B,listB2BValid,listB2C,getClient }
