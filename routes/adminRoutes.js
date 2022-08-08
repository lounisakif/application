const express = require('express')
const router = express.Router()
const isAdmin = require('../middlewares/isAdmin')
const Admin = require('../controllers/adminController')
// les routes
router.post('/addNewAdmin',isAdmin, Admin.addAdmin)
router.delete('/removeAdmin/:id',isAdmin, Admin.removeUser)
router.put('/validerB2B',isAdmin, Admin.validerB2B)
router.get('/listeAdmin',isAdmin, Admin.listAdmin)
router.get('/listB2B',isAdmin, Admin.listB2B)
router.get('/listB2C',isAdmin, Admin.listB2C)
router.get('/listB2Bvalid',isAdmin, Admin.listB2BValid)
router.get('/getclient/:id', Admin.getClient)
module.exports = router
