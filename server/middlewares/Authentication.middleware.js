
const { verifyToken } = require('../helpers/Jwt.helper.js')
const {User} = require('../models/Index') 

 async function authentication(req,res,next) {
  try {
        const token = req.headers.authorization
        console.log(token);
        

        if (!token) {
        throw { name: "Unauthorized", message: "Invalid token" }
        }

        const rawToken = token.split(' ')
        const tokenType = rawToken[0] 
        const tokenValue = rawToken[1]

        if (tokenType !== 'Bearer' || !tokenValue) {
          throw { name: "Unauthorized", message: "Invalid token" }
        }

        const result = verifyToken(tokenValue)

        const user = await User.findByPk(result.id)
        if (!user) {
        throw { name: "Unauthorized", message: "Invalid token" }
        }
    
        req.user = { id: user.id, role: user.role }

        next()
    } catch (error) {
        next(error)
    }
 }

 module.exports = authentication