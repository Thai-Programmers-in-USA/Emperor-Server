module.exports = function(app, server) {
  require('./auth.routes')(app);
}