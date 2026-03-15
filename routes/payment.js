const express = require('express')
const router = express.Router()
const {create, list, read, update,remove } = require('../controllers/payment')
const { auth, admin } = require('../middleware/auth')

router.post('/payment', auth, create)
router.get('/payments', auth, admin, list)
router.get('/payment/:id', auth, read)
router.put('/payment/:id', auth, admin, update)
router.delete('/payment/:id', auth, admin, remove)

module.exports = router