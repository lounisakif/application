const express = require('express')
const router = express.Router()

const bon = require('../controllers/BonController')

router.post('/addBonreception', bon.addBonR) 

router.post('/addBonmouvement', bon.addBonM) 

router.post('/addBontrensfert', bon.addBonT) 
router.get('/listeProducts', bon.getProducts);
router.get('/stocks', bon.getstocks);
router.get('/stock/:adresse', bon.getstock);
module.exports = router