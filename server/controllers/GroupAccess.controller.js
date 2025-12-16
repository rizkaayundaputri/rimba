const { GroupAccess } = require('../models/Index')

class GroupAccessController {

  static async getData(req, res, next) {
    try {
      const groups = await GroupAccess.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      })
      res.status(200).json(groups)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async addGroupAccess(req, res, next) {
    try {
      const { name, description } = req.body
      const newGroup = await GroupAccess.create({ name, description })
      res.status(201).json({ 
        message: `Group access ${newGroup.name} created successfully!`,
        id: newGroup.id,
        name: newGroup.name
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = GroupAccessController