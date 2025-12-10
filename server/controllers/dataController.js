const {User} = require("../models")

class DataController{
 
  static async getData(req,res,next) {
    try {
      const data = await User.findAll({
         attributes : {exclude: ["password","id","createdAt","updatedAt"]}
      })
      res.status(200).json(data)
    } catch (error) {
      console.log(error);
      
      next(error)
    }
  }

  static async getDataAdmin(req, res, next) {
  try {
    const data = await User.findAll({
      where: {
        role: 'Admin'
      },
      attributes: {
        exclude: ["password", "id", "createdAt", "updatedAt"]
      }
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
}
module.exports = DataController