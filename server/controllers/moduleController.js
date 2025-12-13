const { Module } = require("../models");

class ModuleController {

  static async getModule(req, res, next) {
    try {
      const modules = await Module.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] }
      });
      res.status(200).json(modules);
    } catch (error) {
      console.log(error);
      next(error);
    } 
  }

  static async addModule(req, res, next) {
    try {
      const { code, name, routeName, icon, order, parentId, isActive } = req.body;

      const existing = await Module.findOne({
        where: { order, parentId }
      });
      
      if (existing) {
        throw { name: 'Conflict', message: 'Module with the same order and parentId already exists' };
      }
      
      await Module.create({ code, name, routeName, icon, order, parentId, isActive });
      res.status(201).json({ message: `Module ${name} added successfully!` });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteModule(req, res, next) {
    try {
      const { id } = req.params; 
      const module = await Module.findByPk(id);
      if (!module) {
        throw { name: 'NotFound', message: 'Module not found' };
      }
      await module.destroy();
      res.status(200).json({ message: `Module ${module.name} deleted successfully!` });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateModule(req, res, next) {
  try {
    const { id } = req.params;
    const { code, name, routeName, icon, order, parentId, isActive } = req.body;

    const module = await Module.findByPk(id);

    if (!module) {
      throw { name: 'NotFound', message: 'Module not found' };
    }

    // Cek Conflict order + parentId
    const newOrder = order !== undefined ? order : module.order;
    const newParentId = parentId !== undefined ? parentId : module.parentId;

    // Hanya cek kalau order atau parentId berubah
    if (newOrder !== module.order || newParentId !== module.parentId) {
      const existing = await Module.findOne({
        where: {
          order: newOrder,
          parentId: newParentId
        }
      });

      if (existing && existing.id !== module.id) {
        throw { 
          name: 'Conflict', 
          message: 'Module with the same order and parentId already exists' 
        };
      }
    }

    // Update module
    await module.update({
      code: code !== undefined ? code : module.code,
      name: name !== undefined ? name : module.name,
      routeName: routeName !== undefined ? routeName : module.routeName,
      icon: icon !== undefined ? icon : module.icon,
      order: newOrder,
      parentId: newParentId,
      isActive: isActive !== undefined ? isActive : module.isActive
    });

    res.status(200).json({ message: `Module ${name} updated successfully!` });

  } catch (error) {
    console.log(error);
    // Tangani error dari DB supaya client tahu
    if (
      error.name === 'SequelizeValidationError' || 
      error.name === 'SequelizeDatabaseError' ||
      error.name === 'Conflict' ||
      error.name === 'NotFound'
    ) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
}

}

module.exports = ModuleController