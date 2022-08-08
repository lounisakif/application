const express = require('express')
const router = express.Router()
const publicController = require('../controllers/publicController')

router.post('/login', publicController.login)
router.get('/logout', publicController.logout)
router.post('/registerB2B', publicController.registerB2B)
router.post('/registerB2C', publicController.registerB2C)
router.put('/confirmInscription', publicController.confirmInscription)
router.put('/forgot_Password', publicController.forgotPassword)
router.put('/reset_password', publicController.resetPassword)

module.exports = router
