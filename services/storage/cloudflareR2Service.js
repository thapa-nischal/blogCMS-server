const r2 = require('../../config/cloudflareR2Config');

const uploadFile = async (file) => {
    const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: file.filename,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    return r2.upload(params).promise();
};

const deleteFile = async (filename) => {
    const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
    };
    return r2.deleteObject(params).promise();
};

module.exports = { uploadFile, deleteFile };