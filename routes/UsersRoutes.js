const express = require('express')
const router = express.Router()
const isAdmin = require('../middlewares/isAdmin')
const users = require('../controllers/UsersController')

router.get('/getusers', users.listusers)
router.post('/login', users.login)
router.delete('/delete/:id', users.removeUser)
router.post('/addUser', users.addUser)
module.exports = router