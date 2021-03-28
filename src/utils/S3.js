const S3Bucket = require('../aws/aws.s3');
const { S3_BUCKET_NAME } = require('../configs/config');
const { v4: uudiv4 } = require('uuid');

/**
 * @function uploadFileToS3
 * @param {Object[]} files[] | the array of file objects from multer
 * @param {string} fileType | file type - it indicates location in S3 that file will be stored
 * @returns {Promise<string[]>} filePaths
 */

const uploadFileToS3 = async (files, fileType) => {
  try {
    let bucketPath = 'images/';
    let acl = 'public-read';
    const awsFiles = [];
    if (fileType) {
      bucketPath = `${fileType}/`;
    }

    let uploadedFile;

    await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: S3_BUCKET_NAME,
          Key:
            bucketPath +
            uudiv4() +
            '_' +
            file.originalname.replaceAll(' ', '-'),
          Body: file.buffer,
          ACL: acl,
          ContentType: file.mimetype,
        };

        uploadedFile = await S3Bucket.upload(params).promise();
        awsFiles.push(uploadedFile.Location);
      })
    );
    return awsFiles;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
};
