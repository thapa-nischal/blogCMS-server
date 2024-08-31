const { uploadFile, deleteFile } = require('../services/storage/cloudflareR2Service');

const handleFileUpload = async (req, res) => {
    try {
        const fileData = await uploadFile(req.file);
        res.status(200).json({ success: true, file: fileData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'File upload failed', error: error.message });
    }
};

const handleFileDeletion = async (req, res) => {
    try {
        await deleteFile(req.params.filename);
        res.status(200).json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'File deletion failed', error: error.message });
    }
};

module.exports = { handleFileUpload, handleFileDeletion };