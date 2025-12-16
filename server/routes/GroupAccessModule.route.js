const express = require('express')
const router = express.Router()
const isStaff = require('../middlewares/Authorization.middleware')
const groupAccessModuleController = require('../controllers/GroupAccessModule.controller')

router.get('/', isStaff, groupAccessModuleController.getGroupAccessModules)
router.get('/:id', isStaff, groupAccessModuleController.getGroupAccessModuleById)
router.post('/', isStaff, groupAccessModuleController.addGroupAccessModule)
router.delete('/:id', isStaff, groupAccessModuleController.deleteGroupAccessModule)
router.put('/:id', isStaff, groupAccessModuleController.updateGroupAccessModule)
module.exports = router