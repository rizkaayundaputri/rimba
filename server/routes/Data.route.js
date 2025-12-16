const express = require('express')
const DataController = require('../controllers/Data.Controller')
const router = express.Router()
const isStaff = require('../middlewares/Authorization.middleware')

router.get('/allstaff',isStaff,DataController.getData)
router.get('/admin',DataController.getDataAdmin)
router.post('/hobby', DataController.addHobby)
router.get('/hobby',isStaff, DataController.getHobby)

module.exports = router