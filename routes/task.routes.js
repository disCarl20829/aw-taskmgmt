const express = require('express');
const taskController = require('../controllers/task.controller');

const taskMiddleware = require('../middleware/task.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

const router = express.Router();

const protect = [authMiddleware, taskMiddleware]

//BOARDS
router.post('/boards', authMiddleware, taskController.createBoard);
router.patch('/boards/:board_id', protect, taskController.patchBoard);
router.delete('/boards/:board_id', protect, taskController.deleteBoard);
router.get('/boards', authMiddleware, taskController.getBoards);

//LIST
router.post('/lists', protect, taskController.createList);
router.patch('/lists/:list_id', protect, taskController.patchList);
router.delete('/lists/:list_id', protect, taskController.deleteList);
router.get('/lists/:board_id', protect, taskController.getLists);

//CARDS
router.post('/cards', protect, taskController.createCard);
router.patch('/cards/:card_id', protect, taskController.patchCard);
router.delete('/cards/:card_id', protect, taskController.deleteCard);
router.get('/cards/:list_id', protect, taskController.getCard);

//CHECKLIST
router.post('/checklists', protect, taskController.createChecklist);
router.patch('/checklists/:checklist_id', protect, taskController.patchChecklist);
router.delete('/checklists/:checklist_id', protect, taskController.deleteChecklist);
router.get('/checklists/:card_id', protect, taskController.getChecklist);

//-----UTILITIES ADD-----\\\

//CHECKLIST ITEM
router.post('/itemChecklist/:checklist_id', protect, taskController.addItem);
router.patch('/itemChecklist/:item_id', protect, taskController.updateItem);
router.delete('/itemChecklist/:item_id', protect, taskController.removeItem);

//ATTACHMENT CARD
router.post('/attachment/:board_id/:list_id/:card_id/file', protect, uploadMiddleware.single("file"), taskController.addAttachment);
router.post('/attachment/:board_id/:list_id/:card_id/link', protect, taskController.addAttachment);
router.patch('/attachment/:attachment_id/file', protect, uploadMiddleware.single("file"), taskController.editAttachment);
router.patch('/attachment/:attachment_id/link', protect, taskController.editAttachment);
router.delete('/attachment/:attachment_id', protect, taskController.removeAttachment);

module.exports = router;