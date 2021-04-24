const nameValidatorRule = require('./rules/category-name.rule');

module.exports = () => [nameValidatorRule()];
