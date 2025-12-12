
const { signToken } = require('../helpers/jwt')
const {User, GroupAccess, Module, GroupAccessModule} = require('../models')
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
      
      res.status(200).json({
        access_token
      })

      
    } catch (error) {
      next(error)
      console.log(error);
      
    }
  }

  // ------------------------------------------------

  static async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      
      const user = await User.findByPk(userId, {
        include: [
          {
            model: GroupAccess,
            include: [
              {
                model: Module,
                through: {
                  model: GroupAccessModule,
                  attributes: ['canCreate', 'canRead', 'canUpdate', 'canDelete']
                },
                where: { isActive: true },
                required: false
              }
            ]
          }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        throw { name: 'NotFound' };
      }

      const accessibleModules = user.GroupAccess?.Modules?.map(module => ({
        id: module.id,
        name: module.name,
        code: module.code,
        routeName: module.routeName,
        icon: module.icon,
        order: module.order,
        parentId: module.parentId,
        canCreate: module.GroupAccessModule.canCreate,
        canRead: module.GroupAccessModule.canRead,
        canUpdate: module.GroupAccessModule.canUpdate,
        canDelete: module.GroupAccessModule.canDelete
      })).sort((a, b) => a.order - b.order) || [];

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        group_access: user.GroupAccess ? {
          id: user.GroupAccess.id,
          name: user.GroupAccess.name,
          description: user.GroupAccess.description
        } : null,
        accessible_modules: accessibleModules
      });

    } catch (error) {
      next(error);
    }
  }

}

module.exports = UserController


