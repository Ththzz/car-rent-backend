const express = require('express')
const router = express.Router()
const { auth, admin } = require('../middleware/auth')

const {
    create,
    list,
    read,
    update,
    remove
} = require('../controllers/rental')

router.post('/rental', auth, create)         
router.get('/rentals', auth, admin, list)     
router.get('/rental/:id', auth, read)         
router.put('/rental/:id', auth, admin, update) 
router.delete('/rental/:id', auth, remove) 

module.exports = router