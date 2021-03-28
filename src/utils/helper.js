exports.createError = (code, message, validationErrors) => {
  let error = new Error(message);
  error.statusCode = code;
  if (validationErrors) {
    error.errors = validationErrors.errors;
  }
  return error;
};

exports.rootDir = require('path').dirname(require.main.filename);
