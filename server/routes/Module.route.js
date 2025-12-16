const express = require('express')
const router = express.Router()
const isStaff = require('../middlewares/Authorization.middleware')
const ModuleController = require('../controllers/Module.controller')

router.get('/', isStaff, ModuleController.getModule)
router.get('/:id', isStaff, ModuleController.getModuleById)
router.post('/', isStaff, ModuleController.addModule)
router.delete('/:id', isStaff, ModuleController.deleteModule)
router.put('/:id', isStaff, ModuleController.updateModule)
module.exports = router