const express = require('express');

const authMiddleware = require('../middleware/auth.middleware');
const taskMiddleware = require('../middleware/task.middleware');
const mailMiddleware = require('../middleware/mail.middleware');

const userController = require('../controllers/user.controller');

const router = express.Router();

const protect = [authMiddleware, taskMiddleware];

router.post('/terminate', authMiddleware, userController.terminate);
router.patch('/update/', authMiddleware, userController.update);

//SEARCH
router.get('/searchAll', userController.searchAll);
router.get('/searchUser', userController.searchUser);
router.get('/searchBoard/:board_id', userController.searchByBoard);
router.get('/searchCard/:card_id', userController.searchByCard)
router.get('/searchChecklist/:item_id', userController.searchByChecklist)

router.patch('/access/', authMiddleware, userController.changeAccess);

//BOARD MEMBER
router.post('/boardMember/:board_id', authMiddleware, userController.addBoardMember, mailMiddleware)
router.patch('/boardMember/:board_id', authMiddleware, userController.modifyBoardMember);
router.delete('/boardMember/:board_id', authMiddleware, userController.removeBoardMember);

//CARD MEMBER/ASSIGN
router.post('/cardMember/:board_id/:card_id', authMiddleware, userController.addCardMember, mailMiddleware);
router.delete('/cardMember/:board_id/:card_id', authMiddleware, userController.removeCardMember);

//CHECKLIST ASSIGN
router.post('/checklist/:board_id/:card_id/:item_id', protect, userController.assignMember, mailMiddleware);
router.delete('/checklist/:board_id/:card_id/:item_id', protect, userController.unassignMember);

//COMMENT CARD
router.post('/comment/', protect, userController.publishComment);
router.patch('/comment/', authMiddleware, userController.editComment);
router.delete('/comment/', authMiddleware, userController.deleteComment);
router.get('/comment/:card_id', protect, userController.getComment);

module.exports = router;