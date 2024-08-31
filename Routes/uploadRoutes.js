const express = require('express');
const router = express.Router();


const {
    upload,
    uploadFile,
    getFiles,
    getFile,
    getImage,
    deleteFile
} = require('../Controllers/uploadController');

// Post Routes
router.post('/files/upload', upload.single('file'), uploadFile);

// Get Routes
router.get('/files', getFiles);
router.get('/files/:filename', getFile);
router.get('/image/:filename', getImage);

// Delete Routes
router.delete('/files/:id', deleteFile);

module.exports = router;

// const { handleFileUpload, handleFileDeletion } = require('../Controllers/fileController');

// router.post('/file/upload', handleFileUpload);
// router.delete('/file/:fimlename', handleFileDeletion);

// module.exports = router;