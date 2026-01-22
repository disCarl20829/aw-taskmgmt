const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/terminate', authMiddleware, userController.terminate);

//SEARCH
router.get('/searchAll', userController.searchAll);
router.get('/searchUser', userController.searchUser);
router.get('/searchBoard/:board_id', userController.searchByBoard);
router.get('/searchCard/:card_id', userController.searchByCard)
router.get('/searchChecklist/:card_id', userController.searchByChecklist)

//BOARD MEMBER
router.post('/boardMember/:board_id', authMiddleware, userController.addBoardMember)
router.delete('/boardMember/:board_id', authMiddleware, userController.removeBoardMember);

//CARD MEMBER/ASSIGN
router.post('/cardMember/:board_id/:user_id', authMiddleware, userController.addCardMember);
router.delete('/cardMember/:card_id', authMiddleware, userController.removeCardMember);

//CHECKLIST ASSIGN
router.post('/checklist/:checklist_id', authMiddleware, userController.assignMember);
router.delete('/checklist/:checklist_id', authMiddleware, userController.unassignMember);

module.exports = router;