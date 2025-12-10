
const { signToken } = require('../helpers/jwt')
const {User} = require('../models')
class UserController{

  static async login(req,res,next){
    try {
      const {email,password} = req.body
      if (!email) {
        throw {name: 'BadRequest', message:'Email is required'}
      }
      if (!password) {
        throw {name: 'BadRequest', message:'Password is required'}
      }
      
      const userEmail = await User.findOne({
                where: {
                email
                }
            })
      if (!userEmail) {
        throw {name: 'Unauthorized', message:'Invalid password or email'}
      }

      const userPassword = await User.findOne({where:{password}})
      if (!userPassword) {
        throw {name: 'Unauthorized', message:'Invalid password or email'}
      }

      const access_token = signToken({id: userEmail.id})
      
      res.status(200).json({access_token})

      
    } catch (error) {
      next(error)
      console.log(error);
      
    }
  }

}

module.exports = UserController


// function errorHandler(error,req,res,next) {
//   if (error.name === 'Unauthorized') {
//     return res.status(401).json({message: error.message})
//   }
  
//   if (error.name === 'BadRequest') {
//     return res.status(400).json({message: error.message})
//   }

//   if (error.name ==="Forbidden") {
//         return res.status(403).json({message: error.message})
//     }
//   return res.status(500).json({message: "Internal Server Error"})
// }

// module.exports = errorHandler