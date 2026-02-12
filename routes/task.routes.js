const express = require('express');

const taskMiddleware = require('../middleware/task.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/attachment.middleware');
const boardbgMiddleware = require('../middleware/boardbg.middleware')

const taskController = require('../controllers/task.controller');

const router = express.Router();

const protect = [authMiddleware, taskMiddleware]

//BOARDS
router.post('/boards', authMiddleware, taskController.createBoard);
router.patch('/boards/:board_id', protect, taskController.patchBoard);
router.delete('/boards/:board_id', protect, taskController.deleteBoard);
router.get('/boards', authMiddleware, taskController.getBoards);

//BACKGROUND
router.patch('/boardbg/:board_id/photo', protect, boardbgMiddleware.single("file"), taskController.boardBackground);
router.patch('/boardbg/:board_id/color', protect, taskController.boardBackground);

//LIST
router.post('/lists/:board_id', protect, taskController.createList);
router.patch('/lists/:list_id', protect, taskController.patchList);
router.delete('/lists/:list_id', protect, taskController.deleteList);
router.get('/lists/:board_id', protect, taskController.getLists);

//CARDS
router.post('/cards', protect, taskController.createCard);
router.patch('/cards/:board_id/:card_id', protect, taskController.patchCard);
router.delete('/cards/:card_id', protect, taskController.deleteCard);
router.get('/cards/:card_id', protect, taskController.getCard);

//CHECKLIST
router.post('/checklists/:board_id/:card_id', protect, taskController.createChecklist);
router.patch('/checklists/:checklist_id', protect, taskController.patchChecklist);
router.delete('/checklists/:checklist_id', protect, taskController.deleteChecklist);
router.get('/checklists/:card_id', protect, taskController.getChecklist);

//ARCHIVE
router.patch('archiveList/:board_id/:list_id', protect, taskController.archiveList);
router.get('archiveList/:board_id', protect, taskController.getArchivedList);
router.patch('archiveCard/:board_id/:card_id', protect, taskController.archiveCard);
router.get('archiveList/:board_id', protect, taskController.getArchivedCard);

//-----UTILITIES ADD-----\\\

//CHECKLIST ITEM
router.post('/itemChecklist/:board_id/:card_id', protect, taskController.addItem);
router.patch('/itemChecklist/:board_id/:card_id/:item_id', protect, taskController.updateItem);
router.delete('/itemChecklist/:item_id', protect, taskController.removeItem);

//ATTACHMENT CARD
router.post('/attachment/:board_id/:list_id/:card_id/file', protect, uploadMiddleware.single("file"), taskController.addAttachment);
router.post('/attachment/:board_id/:list_id/:card_id/link', protect, taskController.addAttachment);
router.patch('/attachment/:attachment_id/file', protect, uploadMiddleware.single("file"), taskController.editAttachment);
router.patch('/attachment/:attachment_id/link', protect, taskController.editAttachment);
router.delete('/attachment/:board_id/:card_id/:attachment_id', protect, taskController.removeAttachment);

//-----MISCALLANEOUS FEATURES-----\\
router.patch('/moveCard/:board_id/:card_id', protect, taskController.moveCard);
router.post('/duplicateCard/:board_id/:card_id', protect, taskController.duplicateCard)
router.patch('/moveList/:board_id/:list_id', protect, taskController.moveList);
router.post('/duplicateList/:board_id/:list_id', protect, taskController.duplicateList);
router.post('/convertCard/:board_id/:item_id', protect, taskController.convertCard);

router.get('/activityLogs/:card_id', protect, taskController.getActivityLogs);
router.get('/userCard/', protect, taskController.userCard);
router.get('/userActivity/', protect, taskController.userActivity);

module.exports = router;