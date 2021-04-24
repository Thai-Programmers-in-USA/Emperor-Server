const ERROR_MSG = {
  INVALID_INPUTS: `Invalid input(s)`,
};

const VALIDATION_MSG = {
  EMPTY: 'Must not be empty',
  IS_LENGTH_MIN: (min) => `Must be at least ${min} characters`,
  IS_LENGTH_MIN_N_MAX: (min, max) =>
    `Must be at least ${min} characters and not more that ${max} characters`,
};

module.exports = {
  ERROR_MSG,
  VALIDATION_MSG,
};
