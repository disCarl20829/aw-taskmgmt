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
    const newDir = path.join(__dirname, '../public/attachment', `attachment-${newCardId}`);

    await ensureDir(newDir);

    const newFileName = generateFileName(newCardId, oldPath);
    const newPath = path.join(newDir, newFileName);

    const fullOldPath = path.join(__dirname, '../public', oldPath);
    await fs.copyFile(fullOldPath, newPath);

    return `attachment/attachment-${newCardId}/${newFileName}`;
}

module.exports = {
    duplicateAttachmentFile
};