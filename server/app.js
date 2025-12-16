require('dotenv').config() 
const express = require('express')
const errorHandler = require('./middlewares/ErrorHandler.middleware')
const app = express()
const port = process.env.PORT 
const cors = require('cors')
const routes = require('./routes/Index.route')


app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use('/', routes)


app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
