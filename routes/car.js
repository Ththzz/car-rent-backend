//Import ...
const express = require('express')
const router = express.Router()
const { create, list, remove, update, read } = require('../controllers/car')
const upload = require('../middleware/upload')
const { auth, admin } = require('../middleware/auth')


router.post('/car',auth,admin,upload.single("car_image"),create)
router.get('/car',list)
router.get('/car/:plate_id', read)
router.delete('/car/:plate_id',auth,admin,remove)
router.put('/car/:plate_id',auth,admin,upload.single("car_image"),update)

module.exports = router