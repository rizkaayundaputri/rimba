const {GroupAccessModule, Module, GroupAccess} = require('../models')

class groupAccessModuleController {
  static async getGroupAccessModules(req, res, next) {
    try {
      const groupAccessModules = await GroupAccessModule.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          { model: GroupAccess, attributes: ['id', 'name']},
          { model: Module, attributes: ['id', 'name']}
        ]
      });

      const result = groupAccessModules.map(item => ({
        id: item.id,
        groupAccessId: item.groupAccessId,
        moduleId: item.moduleId,
        groupAccess: item.GroupAccess.name,
        module: item.Module.name,
        permission: {
          canCreate: item.canCreate,
          canRead: item.canRead,
          canUpdate: item.canUpdate,
          canDelete: item.canDelete
        }
      }));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async addGroupAccessModule(req, res, next) {
    try {
      const { groupAccessId, moduleId, canCreate, canRead, canUpdate, canDelete } = req.body;
      const existing = await GroupAccessModule.findOne({
        where: { groupAccessId, moduleId }
      });
      
      if (existing) {
        throw { name: 'Conflict', message: 'Group access module already exists' };
      }
      
      await GroupAccessModule.create({ 
        groupAccessId, 
        moduleId, 
        canCreate: canCreate,
        canRead: canRead,
        canUpdate: canUpdate, 
        canDelete: canDelete 
      });
      
      res.status(201).json({ message: 'Group access module added successfully!' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteGroupAccessModule(req, res, next) {
    try {
      const { id } = req.params;
      
      const groupAccessModule = await GroupAccessModule.findByPk(id);
      
      if (!groupAccessModule) {
        throw { name: 'NotFound', message: 'Group access module not found' };
      }
      
      await groupAccessModule.destroy();
      res.status(200).json({message: 'Group access module deleted successfully!'});
    } catch (error) {
      console.log(error);
      next(error);
    } 
  }


  static async updateGroupAccessModule(req, res, next) {
    try {
      const { id } = req.params;
      const { groupAccessId, moduleId, canCreate, canRead, canUpdate, canDelete } = req.body;
      
      const groupAccessModule = await GroupAccessModule.findByPk(id);
      
      if (!groupAccessModule) {
        throw { name: 'NotFound', message: 'Group access module not found' };
      }
      
      // If changing groupAccessId or moduleId, check for conflicts
      if ((groupAccessId && groupAccessId !== groupAccessModule.groupAccessId) || 
          (moduleId && moduleId !== groupAccessModule.moduleId)) {
        const existing = await GroupAccessModule.findOne({
          where: { 
            groupAccessId: groupAccessId || groupAccessModule.groupAccessId, 
            moduleId: moduleId || groupAccessModule.moduleId 
          }
        });
        
        if (existing && existing.id !== groupAccessModule.id) {
          throw { name: 'Conflict', message: 'Group access module combination already exists' };
        }
      }
      
      await groupAccessModule.update({ 
        groupAccessId: groupAccessId || groupAccessModule.groupAccessId,
        moduleId: moduleId || groupAccessModule.moduleId,
        canCreate: canCreate !== undefined ? canCreate : groupAccessModule.canCreate,
        canRead: canRead !== undefined ? canRead : groupAccessModule.canRead,
        canUpdate: canUpdate !== undefined ? canUpdate : groupAccessModule.canUpdate,
        canDelete: canDelete !== undefined ? canDelete : groupAccessModule.canDelete
      });
      
      res.status(200).json({ message: 'Group access module updated successfully!' });
    } catch (error) {
      console.log(error);
      next(error);
    } 
  }

}

module.exports = groupAccessModuleController