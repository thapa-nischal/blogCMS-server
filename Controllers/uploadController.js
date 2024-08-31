const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { ObjectId } = require('mongodb');

const mongoURI = process.env.MONGO_URL;

const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

const uploadFile = (req, res) => {
  res.status(200).json({ success: true, message: "Upload Successfull", file: req.file });
};


const getFiles = (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ err: 'No files exist' });
    }
    return res.json(files);
  });
};

const getFile = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }
    return res.json(file);
  });
};

const getImage = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: 'Not an image' });
    }
  });
};

const deleteFile = (req, res) => {
  gfs.remove({ filename: req.params.filename, root: "uploads" }, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'File deletion failed.', error: err.message });
    }
    res.status(200).json({ success: true, message: 'File deleted successfully.' });
  });
};

module.exports = { upload, uploadFile, getFiles, getFile, getImage, deleteFile };