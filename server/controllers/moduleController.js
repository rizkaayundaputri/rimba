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
      await module.update({ code, name, routeName, icon, order, parentId, isActive });
      res.status(200).json({ message: `Module ${name} updated successfully!` });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = ModuleController