const express = require('express')
const router = express.Router()
const GroupAccessController = require('../controllers/GroupAccess.controller')
const isStaff = require('../middlewares/Authorization.middleware')

router.get('/', isStaff, GroupAccessController.getData)
router.post('/', isStaff, GroupAccessController.addGroupAccess)

module.exports = router