require('dotenv').config() 
const express = require('express')
const UserController = require('./controllers/userController')
const errorHandler = require('./middlewares/errorHandler')
const authentication = require('./middlewares/authentication')
const DataController = require('./controllers/dataController')
const isStaff = require('./middlewares/authorization')
const app = express()
const port = process.env.PORT || 3000 
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.post('/login',UserController.login)

app.use(authentication)

app.get('/allstaff',isStaff,DataController.getData)
app.get('/admin',DataController.getDataAdmin)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
