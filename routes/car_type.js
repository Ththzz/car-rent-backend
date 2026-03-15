//Import
const express = require('express')
const { remove, list, create, update } = require('../controllers/car_type')
const router = express.Router()
const { auth, admin } = require('../middleware/auth')

router.post('/car_type',auth,admin,create)
router.get('/car_type',list)
router.delete('/car_type/:type_id',auth,admin,remove)
router.put('/car_type/:type_id',auth,admin,update)

module.exports = router