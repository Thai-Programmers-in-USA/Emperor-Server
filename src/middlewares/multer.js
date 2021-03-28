const multer = require('multer');
const { v4: uudiv4 } = require('uuid');
const { rootDir } = require('../utils/helper');
const { join } = require('path');

const fileStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, join(rootDir, 'assets'));
  },
  filename: (req, file, cb) => {
    cb(null, `${uudiv4()}_${file.originalname.replace(' ', '-')}`);
  },
});

const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  if (!fileTypes.includes(file.mimetype)) cb(null, false);
  cb(null, true);
};

module.exports = {
  multipleUpload: multer({ storage: fileStorage, fileFilter }).array('files', 12),
  singleUpload: multer({ storage: fileStorage, fileFilter }).single('file'),
};
