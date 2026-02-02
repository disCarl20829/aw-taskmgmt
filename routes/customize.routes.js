const express = require('express');
const customController = require('../controllers/customize.controller');

const taskMiddleware = require('../middleware/task.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const protect = [authMiddleware, taskMiddleware];

//FOR LIST COLORS
router.post('/colorList/:board_id/:list_id', protect, customController.placeColorList);
router.delete('/colorList/:board_id/:list_id', protect, customController.removeColorList);

//MODIFY LABEL
router.patch('/colorList/:board_id', protect, customController.editLabel);
router.delete('/colorList/:board_id', protect, customController.removeLabel)

//LABEL FROM CARD (ADD, REMOVE, RETRIEVE)
router.post('/listLabel/:board_id/:card_id', protect, customController.listLabel);
router.delete('/listLabel/:board_id/:card_id', protect, customController.unlistLabel)
router.get('/list/:board_id', protect, customController.retrieveLabel)

module.exports = router;