
'use strict';
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // if (file.fieldname === 'logoUrl') cb(null, './uploads/profiles/')
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

// const uploader = upload.fields([
//     {
//         name: 'logoUrl',
//         // maxCount: 1
//     },
//     {
//         name: 'loginPhotoUrl',
//         // maxCount: 1,
//     },
//     {
//         name: 'file'
//     },
//     {
//         name: 'files'
//     }
// ]);

module.exports = {upload}