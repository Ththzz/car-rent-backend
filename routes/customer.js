const express = require('express')
const router = express.Router()
const { auth, admin } = require('../middleware/auth')
const { create, list, update, remove, profile, updateProfile } = require('../controllers/customer')

router.post('/customer',auth,create)
router.get('/customer',auth,admin,list)
router.get('/customer/profile',auth,profile)
router.put('/customer/profile',auth,updateProfile)
router.put('/customer/:cust_id',auth,admin,update)
router.delete('/customer/:cust_id',auth,admin,remove)

module.exports = router