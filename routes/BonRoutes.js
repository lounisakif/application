const express = require('express')
const router = express.Router()

const bon = require('../controllers/BonController')

router.post('/addBonreception', bon.addBonR) 

router.post('/addBonmouvement', bon.addBonM) 

router.post('/addBontrensfert', bon.addBonT) 

module.exports = router