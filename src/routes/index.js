module.exports = function(app, server) {
  require('./auth.routes')(app);
  require('./employee.routes')(app);
}