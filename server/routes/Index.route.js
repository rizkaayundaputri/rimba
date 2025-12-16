const express = require('express')
const router = express.Router()

const userRoutes = require('./User.route')
const moduleRoutes = require('./Module.route')
const dataRoutes = require('./Data.route')
const groupAccessRoutes = require('./GroupAccess.route')
const groupAccessModuleRoutes = require('./GroupAccessModule.route')
const authentication = require('../middlewares/Authentication.middleware')
const UserController = require('../controllers/UserController.controller')

//public
router.get('/route', UserController.getRoutes)
router.post('/login',UserController.login)

router.use(authentication)
router.use('/', userRoutes)
router.use('/', dataRoutes)
router.use('/module', moduleRoutes)
router.use('/group-access', groupAccessRoutes)
router.use('/group-access-module', groupAccessModuleRoutes)

module.exports = router