module.exports = function(app, server) {
  require('./product.routes')(app)
  require('./auth.routes')(app);
  require('./employee.routes')(app);
}
