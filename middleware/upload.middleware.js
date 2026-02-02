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
        const card_id = req.body.card_id || req.params.card_id;
        const uploadPath = path.join(__dirname, '../public/uploads/attachment', `attachment-${card_id}`);

        ensureDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const card_id = req.body.card_id || req.params.card_id;
        if (!card_id) return cb(new Error("card_id not Found or Required!"));

        const timestapp = Date.now();
        const fileName = `attachment-${card_id}-${timestapp}${path.extname(file.originalname)}`;

        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|pdf|docx)$/;;
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Invalid File Type"), false);
}

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})