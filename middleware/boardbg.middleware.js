const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../backgrounds');

        ensureDir(uploadPath);
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const board_id = req.body.board_id || req.params.board_id;
        if (!board_id) return cb(new Error("board_id not Found or Required!"));

        const timestapp = Date.now();
        const fileName = `background-board-${board_id}-${timestapp}${path.extname(file.originalname)}`;

        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png)$/;
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Invalid File Type"), false);
}

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})