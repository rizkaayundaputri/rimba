const express = require('express')
const UserController = require('../controllers/UserController.controller')
const router = express.Router()

//protected
router.get('/auth/me', UserController.getProfile)

module.exports = router