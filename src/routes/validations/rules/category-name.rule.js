const { VALIDATION_MSG } = require('../../../configs/error-messages');
const { body } = require('express-validator');

module.exports = () => [
  body('name')
    .trim()
    .notEmpty()
    .withMessage(VALIDATION_MSG.EMPTY)
    .bail()
    .isLength({ min: 3 })
    .withMessage(VALIDATION_MSG.IS_LENGTH_MIN(3))
    .bail()
    .toLowerCase(),
];
