//Import ...
const express = require('express')
const router = express.Router()
const { register,login,currentUser, currentAdmin } = require('../controllers/auth')
const { auth, admin } = require('../middleware/auth')


router.post('/register',register)
router.post('/login',login)
router.post('/current_user',auth,currentUser)
router.post('/current_admin',auth,admin,currentAdmin)


module.exports = router