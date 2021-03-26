exports.createError = (code, message, errors) => {
  let error = new Error(message);
  error.statusCode = code;
  if (errors) {
    error.errors = errors.errors;
  }
  return error;
};
