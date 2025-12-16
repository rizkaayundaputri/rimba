const {User, Hobby} = require('../models/Index')


class DataController{
 
  static async getData(req,res,next) {
    try {
      const data = await User.findAll({
         attributes : {exclude: ["password","id","createdAt","updatedAt"]}
      })
      res.status(200).json(data)
    } catch (error) {
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

  static async addHobby(req, res, next) {
    try {
      const { name, description } = req.body;
      await Hobby.create({name,description})
      res.status(201).json({ message: `${name} hobby added successfully!` });
    } catch (error) {
      console.log(error);
      next(error);
    }
 }

 static async getHobby(req, res, next) {
    try {
      const hobbies = await Hobby.findAll();
      res.status(200).json(hobbies);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = DataController