const { GroupAccess } = require('../models')

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
}

module.exports = GroupAccessController