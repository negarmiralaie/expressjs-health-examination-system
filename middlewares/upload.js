const AuthHandler = require('../components/auth/handler');
const { StatusList } = require('../components/enums');
const response = require('../components/responseHandler');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const upload = path.join(__dirname, '..', 'public', 'uploads');
      cb(null, upload);
    },
    filename: function (req, file, cb) {
      cb(null, `${uuid.v4()}.${file.originalname.split('.').pop()}`);
    },
});

function fileFilter(req, file, cb) {
    const type = file.mimetype;
    const typeArray = type.split('/');
    console.log(typeArray);
    if (typeArray[0] == 'image') {
      cb(null, true);
      // compress();
    } else {
      cb(null, false);
    }
};

const uploadMiddleware = {
    upload: async (req, res, next) => {
        console.log('11111111111111111111114444');
        try{
            const upload = multer({ storage, fileFilter });
            console.log(upload);
            next();
            return upload;
        } catch (error) {
            console.log('ssssssssss')
        }
    },
};

module.exports = uploadMiddleware;
