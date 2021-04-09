const { validationResult } = require('express-validator');
const { createError } = require('../utils/helper');
const CategoryModel = require('../models/category.model');

exports.createCategory = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      throw createError(422, 'Invalid input(s)', validationErrors);

    const { name } = req.body;

    const createdCategory = await CategoryModel.create({
      name: name[0].toUpperCase() + name.slice(1).toLowerCase(),
    });

    if (!createdCategory) throw new Error();

    res.status(201).json({ createdCategory });
  } catch (err) {
    next(err);
  }
};
