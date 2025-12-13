
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
    // 1️⃣ Ambil ID user yang sedang login
    // ID ini berasal dari token JWT (aman, bukan dari frontend)
    const userId = req.user.id;

    // 2️⃣ Ambil data user dari database
    // Sekaligus ambil group access dan module yang boleh diakses
    const user = await User.findByPk(userId, {
      include: [
        {
          // 3️⃣ Ambil data group / role user
          model: GroupAccess,
          include: [
            {
              // 4️⃣ Ambil daftar module yang dimiliki group
              model: Module,

              // 5️⃣ Ambil hak akses CRUD dari tabel penghubung
              through: {
                model: GroupAccessModule,
                attributes: ['canCreate', 'canRead', 'canUpdate', 'canDelete']
              },

              // 6️⃣ Hanya module yang aktif
              where: { isActive: true },

              // 7️⃣ Tetap ambil user meskipun tidak punya module
              required: false
            }
          ]
        }
      ],

      // 8️⃣ Jangan kirim password ke frontend
      attributes: { exclude: ['password'] }
    });

    // 9️⃣ Jika user tidak ditemukan
    if (!user) {
      throw { name: 'NotFound' };
    }

    // 🔟 Rapikan data module supaya mudah dipakai frontend
    const accessibleModules = user.GroupAccess?.Modules?.map(module => ({
      // data dasar module
      id: module.id,
      name: module.name,
      code: module.code,
      routeName: module.routeName,
      icon: module.icon,
      order: module.order,
      parentId: module.parentId,

      // hak akses (permission)
      canCreate: module.GroupAccessModule.canCreate,
      canRead: module.GroupAccessModule.canRead,
      canUpdate: module.GroupAccessModule.canUpdate,
      canDelete: module.GroupAccessModule.canDelete

    }))
    // 1️⃣1️⃣ Urutkan module (biasanya untuk sidebar)
    .sort((a, b) => a.order - b.order)
    // fallback jika tidak ada module
    || [];

    // 1️⃣2️⃣ Kirim hasil ke frontend
    res.status(200).json({
      success: true,

      // data user
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },

      // data group / role
      group_access: user.GroupAccess ? {
        id: user.GroupAccess.id,
        name: user.GroupAccess.name,
        description: user.GroupAccess.description
      } : null,

      // daftar module + permission
      accessible_modules: accessibleModules
    });

  } catch (error) {
    next(error);
  }
}

}

module.exports = UserController


