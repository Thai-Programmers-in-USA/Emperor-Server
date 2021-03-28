const AWS = require('aws-sdk');
const { S3_CONFIG } = require('../configs/config');

module.exports = new AWS.S3({ ...S3_CONFIG });
