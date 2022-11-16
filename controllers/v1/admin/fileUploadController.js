'use strict';

const fileSizeFormatter = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
}; 

const uploadFileController = {

    singleFileUpload: async (file) => {
        try{
            // console.log('file.originalname', file.originalname)
            const file = {
                fileName: file.originalname,
                filePath: file.path,
                fileType: file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2), // 0.00
            }
            return file;
        }catch(error) {
            return error;
        }
    },

    multipleFileUpload: async (files) => {
        try{
            const filesArray = [];
            await files.forEach(element => {
                const file = {
                    fileName: element.originalname,
                    filePath: element.path,
                    fileType: element.mimetype,
                    fileSize: fileSizeFormatter(element.size, 2)
                }
                filesArray.push(file);
            });
            return filesArray;
        }catch(error) {
            return error;
        }
    },

    getallSingleFiles: async () => {
        try{
            // const files = await SingleFile.find();
            // res.status(200).send(files);
        }catch(error) {
            res.status(400).send(error.message);
        }
    },

    getallMultipleFiles: async (req, res, next) => {
        try{
            // const files = await MultipleFile.find();
            // res.status(200).send(files);
        }catch(error) {
            res.status(400).send(error.message);
        }
    },

    getFileByUserId: async () => {
        try{
            // const files = await SingleFile.find();
            // res.status(200).send(files);
        }catch(error) {
            res.status(400).send(error.message);
        }
    },
}

module.exports = uploadFileController;