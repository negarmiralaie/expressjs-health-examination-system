
const multipleFileUpload = (files) => {
  try{
    let filesArray = [];
      files.forEach(element => {
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
      res.status(400).send(error.message);
  }
}

module.exports = {multipleFileUpload};