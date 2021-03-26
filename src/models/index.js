const Product = require('./product.model');
const Category = require('./category.model');
const ProductCategory = require('./product-category.model');
const Stock = require('./stock.mode');
const Photo = require('./photo.model');
const Employee = require('./employee.model');
const { sequelize } = require('../configs/config');

module.exports = async function () {
  try {
    // TODO Set up relationship
    // TODO 1) Product m <--> n Category
    Category.belongsToMany(Product, { through: ProductCategory });
    Product.belongsToMany(Category, { through: ProductCategory });

    // TODO 2) Product 1 <--> n Stock
    Stock.belongsTo(Product, { constraints: true, onDelete: 'CASCADE' });
    Product.hasMany(Stock);

    // TODO 3) Product 1 <--> n Photo
    Photo.belongsTo(Product, { constraints: true, onDelete: 'CASCADE' });
    Product.hasMany(Photo);

    // ? Reset schema
    // return sequelize.sync({ force: true });
    return await sequelize.sync();

    // const result = await sequelize.sync();
    // return result;
  } catch (err) {
    throw err;
  }
};
