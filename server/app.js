require('dotenv').config() 
const express = require('express')
const UserController = require('./controllers/userController')
const errorHandler = require('./middlewares/errorHandler')
const authentication = require('./middlewares/authentication')
const DataController = require('./controllers/dataController')
const isStaff = require('./middlewares/authorization')
const app = express()
const port = process.env.PORT 
const cors = require('cors')
const ModuleController = require('./controllers/moduleController')
const groupAccessModuleController = require('./controllers/groupAccessModuleController')

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/route', UserController.getRoutes)
app.post('/login',UserController.login)


app.use(authentication)

app.get('/auth/me', UserController.getProfile)
app.get('/allstaff',isStaff,DataController.getData)
app.get('/admin',DataController.getDataAdmin)
app.post('/hobby', DataController.addHobby)
app.get('/hobby',isStaff, DataController.getHobby)
app.get('/module', isStaff, ModuleController.getModule)
app.post('/module', isStaff, ModuleController.addModule)
app.delete('/module/:id', isStaff, ModuleController.deleteModule)
app.put('/module/:id', isStaff, ModuleController.updateModule)
app.get('/group-access-module', isStaff, groupAccessModuleController.getGroupAccessModules)
app.post('/group-access-module', isStaff, groupAccessModuleController.addGroupAccessModule)
app.delete('/group-access-module/:id', isStaff, groupAccessModuleController.deleteGroupAccessModule)
app.put('/group-access-module/:id', isStaff, groupAccessModuleController.updateGroupAccessModule)


app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
