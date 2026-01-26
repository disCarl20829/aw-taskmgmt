const path = require('path');
const fs = require('fs/promises');

async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

function generateFileName(card_id, originalPath) {
    const ext = path.extname(originalPath);
    const timestamp = Date.now();
    return `attachment-${card_id}-${timestamp}${ext}`;
}

async function duplicateAttachmentFile(oldPath, newCardId) {
    const uploadBase = path.join(__dirname, '../public/uploads/attachment');
    const newDir = path.join(uploadBase, `attachment-${newCardId}`);

    await ensureDir(newDir);

    const newFileName = generateFileName(newCardId, oldPath);
    const newPath = path.join(newDir, newFileName);

    await fs.copyFile(oldPath, newPath);

    return newPath;
}

module.exports = {
    duplicateAttachmentFile
};
