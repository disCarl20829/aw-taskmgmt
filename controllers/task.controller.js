const db = require('../db');

const fs = require('fs/promises');
const path = require('path');

const catchAsync = require('../middleware/catch.middleware')
const messageHandler = require('../utilities/message.handler')
const duplicateAttachmentFile = require('../utilities/attachment.storage');
const emit = require('../utilities/socket');

//CREATE
exports.createBoard = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const user_id = req.session.user.user_id;
        const { board_title, board_description, board_visibility } = req.body;

        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO board (board_title, board_description, board_owner, board_visibility) VALUES (?, ?, ?, ?)',
            [board_title, board_description, user_id, board_visibility]
        );

        const board_id = result.insertId;

        await connection.query('INSERT INTO board_user (board_id, user_id, role) VALUES (?, ?, ?)',
            [board_id, user_id, 'admin']
        );

        const [board] = await connection.query('SELECT * FROM board WHERE board_id = ?',
            [board_id]
        );

        await connection.commit();

        emit.emitGlobal(req, 'board:created', { board: board[0] })
        res.json({ message: "Board Successfully Created!", board: board[0] });
    } finally { if (connection) await connection.release() }
});

//PATCH/UPDATE
exports.patchBoard = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id;
        //const user_id = req.session.user.user_id;
        const { board_title, board_description, board_background, board_visibility } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query("SELECT * FROM board WHERE board_id = ?",
            [board_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Board Not Found!" });
        }

        const updatedTitle = board_title && board_title.trim() !== '' ? board_title : row[0].board_title;
        const updatedDescription = board_description && board_description.trim() !== '' ? board_description : row[0].board_description;
        const updatedBackground = board_background && board_background.trim() !== '' ? board_background : row[0].board_background;
        const updatedVisibility = board_visibility && board_visibility.trim() !== '' ? board_visibility : row[0].board_visibility;

        await connection.query('UPDATE board SET board_title = ?, board_description = ?, board_background = ?, board_visibility = ? WHERE board_id = ?',
            [updatedTitle, updatedDescription, updatedBackground, updatedVisibility, board_id]
        );

        await connection.commit();

        emit.emitBoard(req, 'board:updated', { board_id, board: { board_title: updatedTitle, board_description: updatedDescription, board_background: updatedBackground } })
        res.json({ message: "Board Patched Successfully!", board: board });
    } finally { if (connection) await connection.release() }
});

//DELETE
exports.deleteBoard = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id;
        const user_id = req.session.user.user_id;

        await connection.beginTransaction();

        const [result] = await connection.query('DELETE FROM board_user WHERE board_id = ?',
            [board_id]
        )

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Board not Found from board_user)" })
        }

        await connection.query('DELETE FROM board WHERE board_id = ?',
            [board_id]
        );

        const [board] = await db.query(`SELECT DISTINCT t1.* FROM board AS t1 LEFT JOIN board_user AS t2 ON t1.board_id = t2.board_id AND t2.user_id = ? WHERE t1.board_visibility IN ('public', 'workspace') OR t1.board_owner = ? OR t1.board_visibility = 'private' AND t2.user_id IS NOT NULL`,
            [user_id, user_id]
        );

        await connection.commit();

        emit.emitGlobal(req, 'board:deleted', { board_id })
        res.json({ message: "Board was Deleted Successfully!", board: board });
    } finally { if (connection) await connection.release() }
});

//RETRIEVE
exports.getBoards = catchAsync(async (req, res) => {
    const user_id = req.session.user.user_id;

    const [result] = await db.query(`SELECT DISTINCT t1.* FROM board AS t1 LEFT JOIN board_user AS t2 ON t1.board_id = t2.board_id AND t2.user_id = ? WHERE t1.board_visibility IN ('public', 'workspace') OR t1.board_owner = ? OR t1.board_visibility = 'private' AND t2.user_id IS NOT NULL`,
        [user_id, user_id]
    );

    res.json({ message: "Boards was Successfully Retrieved!", boards: result })
});

exports.getUserBoards = catchAsync(async (req, res) => {
    const {user_id} = req.params;

    const [result] = await db.query(`SELECT DISTINCT t1.* FROM board AS t1 LEFT JOIN board_user AS t2 ON t1.board_id = t2.board_id AND t2.user_id = ? WHERE t1.board_visibility IN ('public', 'workspace') OR t1.board_owner = ? OR t1.board_visibility = 'private' AND t2.user_id IS NOT NULL`,
        [user_id, user_id]
    );

    res.json({ message: "Boards was Successfully Retrieved!", boards: result })
});

exports.getBoardById = catchAsync (async (req, res) => {
  const { board_id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM board WHERE board_id = ?',
      [board_id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.json({ board: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

exports.aboutBoard = catchAsync(async (req, res) => {
    const board_id = req.params.board_id || req.body.board_id;
    const user_id = req.session.user.user_id;

    let about = {};

    const [board] = await db.query('SELECT * FROM board WHERE board_id = ?',
        board_id
    )

    if (board.length === 0) {
        return res.status(404).json({ message: "Could not Find Specific Board." });
    }

    const [admin] = await db.query(`SELECT *, CASE WHEN user_id = ? THEN true ELSE false END AS isUser FROM board_user WHERE board_id = ? AND role = 'admin'`,
        [board_id, user_id]
    )

    about.board_description = board[0];
    about.admin = admin;

    res.json({ message: "Retrieved Board Information Successfully!", about: about });
})

//BACKGROUND
exports.boardBackground = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id;
        const { color, clear } = req.body;

        const [board] = await connection.query('SELECT board_background FROM board WHERE board_id = ?',
            [board_id]
        );

        let background;

        if (clear) {
            background = null;
        } else if (req.file) {
            background = `backgrounds/${req.file.filename}`;
        } else if (color) {
            background = color;
        } else {
            return res.status(400).json({ message: "None Background Provided!" });
        }

        await connection.beginTransaction();

        await connection.query("UPDATE board SET board_background = ? WHERE board_id = ?",
            [background, board_id]
        )

        const oldBg = board[0].board_background

        await connection.commit();

        if (oldBg && oldBg !== background) {
            if (!oldBg || oldBg.startsWith('#')) return;

            const fullPath = path.join(__dirname, '../public', oldBg);
            fs.unlink(fullPath)
                .catch(err => console.error("Background Deletion Failed!", err))
        }

        emitBoard(req, board_id, 'board:background-updated', { board_id, backgroundF });
        res.json({ message: "Placed Background for Board Successfully!" })
    } finally { if (connection) await connection.release() }
})

//-----LISTS HANDLING-----\\ 
// ONLY DO REFRESH INSTEAD OF RETURNING ARRAY

//CREATE
exports.createList = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.body.board_id || req.params.board_id
        const { list_name, list_position } = req.body;

        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO list (board_id, list_name, list_position) VALUES (?, ?, ?)',
            [board_id, list_name, list_position]
        );

        const list_id = result.insertId;

        const [list] = await connection.query('SELECT * FROM list WHERE list_id = ?',
            [list_id]
        );

        await connection.commit();

        emitBoard(req, board_id, 'list:created', { list: list[0] });
        res.json({ message: "List Created Successfully!", list: list[0] });
    } finally { if (connection) await connection.release() }
});

//PATCH/UPDATE
exports.patchList = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const list_id = req.params.list_id
        const { list_name, list_color, list_position } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * FROM list WHERE list_id = ?',
            [list_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "List Not Found!" });
        }

        const updatedName = list_name && list_name.trim() !== '' ? list_name : row[0].list_name;
        const updatedColor = list_color && list_color.trim() !== '' ? list_color : row[0].list_color;
        const updatedPosition = list_position !== undefined && list_position !== null ? list_position : row[0].list_position;

        await connection.query('UPDATE list SET list_name = ?, list_color = ?, list_position = ? WHERE list_id = ?',
            [updatedName, updatedColor, updatedPosition, list_id]
        );

        await connection.commit();

        emitBoard(req, row[0].board_id, 'list:updated', { list_id, list: { list_name: updatedName, list_color: updatedColor, list_position: updatedPosition } });
        res.json({ message: "List Patched Successfully!" });
    } finally { if (connection) await connection.release() }
});

//DELETE
exports.deleteList = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const list_id = req.params.list_id || req.body.list_id;

        await connection.beginTransaction();

        await connection.query('DELETE FROM list WHERE list_id = ?',
            [list_id]
        )

        await connection.commit();

        emitBoard(req, board_id, 'list:deleted', { list_id });
        res.json({ message: "List was Deleted Successfully!" });
    } finally { if (connection) await connection.release() }
});

//RETRIEVE
exports.getLists = catchAsync(async (req, res) => {
    const board_id = req.params.board_id;
    const user_id = req.session.user.user_id;

    const [lists] = await db.query('SELECT t1.*, t2.role, t3.* FROM list AS t1 JOIN board_user AS t2 ON t1.board_id = t2.board_id JOIN board AS t3 ON t1.board_id = t3.board_id WHERE t1.board_id = ? AND t2.user_id = ? AND t1.is_archived = 0 ORDER BY t1.list_position ASC',
        [board_id, user_id]
    );

    if (lists.length === 0) {
        return res.json({ message: "Lists were retrieved!", lists: [] });
    }

    const list_ids = lists.map(l => l.list_id);

    let cards = []; 
    if (list_ids.length > 0) {
        const [cardResult] = await db.query('SELECT * FROM card WHERE is_archived = 0 AND list_id IN (?) ORDER BY card_position ASC',
            [list_ids]
        );
        cards = cardResult
    }

    const cardIds = cards.map(c => c.card_id);

    if (cardIds.length > 0) {
        const [attachmentCounts] = await db.query(
            'SELECT card_id, COUNT(*) as count FROM attachments WHERE card_id IN (?) GROUP BY card_id',
            [cardIds]
        );

        const [cardLabels] = await db.query(
            'SELECT t1.card_id, t2.* FROM card_labels AS t1 JOIN labels AS t2 ON t1.label_id = t2.label_id WHERE t1.card_id IN (?)',
            [cardIds]
        );

        const [checklistCounts] = await db.query(
            'SELECT t1.card_id, COUNT(t2.item_id) AS count FROM checklist AS t1 LEFT JOIN checklist_items AS t2 ON t1.checklist_id = t2.checklist_id WHERE t1.card_id IN (?) GROUP BY t1.card_id',
            [cardIds]
        );

        const attachmentMap = new Map(attachmentCounts.map(a => [a.card_id, a.count]));
        const checklistMap = new Map(checklistCounts.map(c => [c.card_id, c.count]));

        const labelMap = new Map();
        cardLabels.forEach(label => {
            if (!labelMap.has(label.card_id)) {
                labelMap.set(label.card_id, []);
            }
            labelMap.get(label.card_id).push(label);
        });

        cards.forEach(card => {
            card.attachmentCount = attachmentMap.get(card.card_id) || 0;
            card.labels = labelMap.get(card.card_id) || [];
            card.checklistItemCount = checklistMap.get(card.card_id) || 0;
        });
    }

    const cardsByList = new Map();
    cards.forEach(card => {
        if (!cardsByList.has(card.list_id)) {
            cardsByList.set(card.list_id, []);
        }
        cardsByList.get(card.list_id).push(card);
    });

    lists.forEach(list => {
        list.cards = cardsByList.get(list.list_id) || [];
    });

    res.json({ message: "Lists were Retrieved!", lists: lists });
});

//-----CARD HANDLING-----\\
// ONLY DO REFRESH INSTEAD OF RETURNING ARRAY

//CREATE
exports.createCard = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { list_id, card_name, card_description, card_position, due_date, due_time } = req.body;

        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO card (list_id, card_name, card_description, card_position, due_date, due_time) VALUES (?, ?, ?, ?, ?, ?)',
            [list_id, card_name, card_description, card_position, due_date, due_time]
        )

        const card_id = result.insertId;

        const [card] = await connection.query('SELECT * FROM card WHERE card_id = ?',
            [card_id]
        );

        await connection.commit();

        emitBoard(req, board_id, 'card:created', { card: card[0] });
        res.json({ message: "Card Created Successfully!", card: card[0] })
    } finally { if (connection) await connection.release() }
});

//PATCH/UPDATE
exports.patchCard = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.body.board_id || req.params.board_id;
        const card_id = req.body.card_id || req.params.card_id;
        const { card_name, card_description, card_position, due_date, due_time, completed } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * FROM card WHERE card_id = ?',
            [card_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Card Not Found!" })
        }

        const updatedName = card_name && card_name.trim() !== '' ? card_name : row[0].card_name;
        const updatedDescription = card_description && card_description.trim() !== '' ? card_description : row[0].card_description;
        const updatedPosition = card_position !== undefined ? card_position : row[0].card_position;
        const updatedDate = due_date !== undefined ? due_date : row[0].due_date;
        const updatedTime = due_time !== undefined ? due_time : row[0].due_time;
        const updatedCompleted = completed !== undefined ? completed : row[0].completed;

        await connection.query('UPDATE card SET card_name = ?, card_description = ?, card_position = ?, due_date = ?, due_time = ?, completed = ? WHERE card_id = ?',
            [updatedName, updatedDescription, updatedPosition, updatedDate, updatedTime, updatedCompleted, card_id]
        );

        const actor = await messageHandler.getUser(req.session.user.user_id, connection);

        const hasInput = due_date !== '' && due_time !== '';
        const hadDue = row[0].due_date !== null && row[0].due_time !== null;

        let actionType;
        let actionData
        if (hasInput && !hadDue) {
            actionType = 'SET_DUE';
            actionData = JSON.stringify({ user: actor.user_name, date: due_date, time: due_time });
        } else if (hasInput && hadDue) {
            actionType = 'CHANGED_DUE';
            actionData = JSON.stringify({ user: actor.user_name, date: due_date, time: due_time });
        } else {
            actionType = 'REMOVED_DUE';
            actionData = JSON.stringify({ user: actor.user_name });
        }

        if (actionType) {
            await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
                [actor.user_id, board_id, card_id, actionType, actionData]
            )
        }

        await connection.commit();

        emitBoard(req, board_id, 'card:updated', { card_id, card: { card_name: updatedName, card_description: updatedDescription, card_position: updatedPosition, completed: updatedCompleted } });
        res.json({ message: "Card Patched Successfully!" });
    } finally { if (connection) await connection.release() }
});

//DELETE
exports.deleteCard = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const card_id = req.params.card_id || req.body.card_id;

        await connection.beginTransaction();

        const [result] = await connection.query('SELECT * FROM card WHERE card_id = ?',
            [card_id]
        );

        if (result.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Card Not Found!" });
        }

        const [attachments] = await connection.query('SELECT * FROM attachments WHERE card_id = ?',
            [card_id]
        );

        const filePaths = attachments.map(r => path.join(__dirname, '../public', r.file_path)).filter(Boolean);
        if (filePaths.length > 0) await cleanupFile(filePaths);

        await connection.query('DELETE FROM card WHERE card_id = ?',
            [card_id]
        )

        await connection.commit();

        emitBoard(req, board_id, 'card:deleted', { card_id });
        res.json({ message: "Card was Deleted Successfully!" });
    } finally { if (connection) await connection.release() }
});

//RETRIEVE (CARD INFO)
exports.getCard = catchAsync(async (req, res) => {
    const card_id = req.body.card_id;
    const user_id = req.session.user.user_id

    const [result] = await db.query('SELECT * FROM card WHERE card_id = ?',
        [card_id]
    );

    if (result.length === 0) {
        return res.status(404).json({ message: "Card Not Found!" });
    }

    const card = result[0];

    const [attachments] = await db.query('SELECT * FROM attachments WHERE card_id = ?',
        [card_id]
    );

    const [labels] = await db.query('SELECT t2.* FROM card_labels AS t1 JOIN labels AS t2 ON t1.label_id = t2.label_id WHERE t1.card_id = ?',
        [card_id]
    );

    const [logs] = await db.query('SELECT t1.log_id AS id, t1.card_id, t1.action AS content, t1.created_at AS date, "activity" AS type, CASE WHEN t1.user_id = ? THEN 1 ELSE 0 END AS isUser FROM activity_logs AS t1 WHERE t1.card_id = ? UNION ALL SELECT t2.comment_id AS id, t2.card_id, t2.comment AS content, t2.created_at AS date, "comment" AS type, CASE WHEN t2.user_id = ? THEN 1 ELSE 0 END AS isUser FROM comments AS t2 WHERE t2.card_id = ? ORDER BY date DESC',
        [user_id, card_id, user_id, card_id]
    );

    const activities = logs
        .filter(row => row.type === 'activity')
        .map(buildActivity);

    const comments = logs
        .filter(row => row.type === 'comment')
        .map(row => ({ comment_id: row.log_id, card_id: row.card_id, created_at: row.created_at, isUser: !!row.isUser, type: 'comment', content: row.action_data || row.actionType || null }));

    const [checklists] = await db.query('SELECT * FROM checklist WHERE card_id = ?',
        [card_id]
    );

    const [checklistItems] = await db.query(
        'SELECT ci.* FROM checklist_items ci JOIN checklist c ON ci.checklist_id = c.checklist_id WHERE c.card_id = ?',
        [card_id]
    );

    checklists.forEach(checklist => {
        checklist.items = checklistItems.filter(item => item.checklist_id === checklist.checklist_id);
    });

    card.attachments = attachments;
    card.labels = labels;
    card.activities = activities;
    card.comments = comments;
    card.items = checklists;

    res.json({ message: "Cards were Retrieved", card: card })
});

//-----CHECKLIST HANDLING-----\\

//CREATE
exports.createChecklist = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.body.board_id || req.params.board_id;
        const card_id = req.body.card_id || req.params.card_id;
        const user_id = req.session.user.user_id;
        const checklist_title = req.body.checklist_title

        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO checklist (card_id, checklist_title) VALUES (?, ?)',
            [card_id, checklist_title]
        )

        const actor = await messageHandler.getUser(req.session.user.user_id);

        const actorName = req.session.user.user_id === user_id ? "self" : actor.user_name;

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, board_id, card_id, 'CREATED_CHECKLIST', JSON.stringify({ user: actorName })]
        )

        const checklist_id = result.insertId;

        const [checklist] = await connection.query('SELECT * FROM checklist WHERE checklist_id = ?',
            [checklist_id]
        );

        await connection.commit();

        emitBoard(req, board_id, 'checklist:created', { checklist: checklist[0] });
        res.json({ message: "Checklist Created Successfully!", checklist: checklist[0] })
    } catch (err) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Checklist Creation Failed!", error: err.message })
        throw err;
    } finally { if (connection) await connection.release() }
});

//PATCH/UPDATE
exports.patchChecklist = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const checklist_id = req.body.checklist_id || req.params.checklist_id;
        const { checklist_title, checklist_position } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * FROM checklist WHERE checklist_id = ?',
            [checklist_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Checklist Not Found!" })
        }

        const updatedTitle = checklist_title && checklist_title.trim() !== '' ? checklist_title : row[0].checklist_title;
        const updatedPosition = checklist_position !== undefined ? checklist_position : row[0].checklist_position;

        await connection.query('UPDATE checklist SET checklist_title = ?, checklist_position = ? WHERE checklist_id = ?',
            [updatedTitle, updatedPosition, checklist_id]
        );

        const [checklist] = await connection.query('SELECT * FROM checklist WHERE checklist_id = ?',
            [checklist_id]
        );

        await connection.commit();

        emitBoard(req, board_id, 'checklist:updated', { checklist_id, changes: { checklist_title: updatedTitle, checklist_position: updatedPosition } });
        res.json({ message: "Checklist Patched Successfully!", checklist: checklist[0] });
    } finally { if (connection) await connection.release() }
});

//DELETE
exports.deleteChecklist = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const checklist_id = req.params.checklist_id || req.body.checklist_id;

        await connection.beginTransaction();

        await connection.query('DELETE FROM checklist_items WHERE checklist_id = ?',
            [checklist_id]
        )

        await connection.query('DELETE FROM checklist WHERE checklist_id = ?',
            [checklist_id]
        )

        const [checklist] = await connection.query('SELECT * FROM checklist WHERE checklist_id = ?',
            [checklist_id]
        );

        await connection.commit();

        emitBoard(req, board_id, 'checklist:deleted', { checklist_id });
        res.json({ message: "Checklist was Deleted Successfully!", checklist });
    } finally {
        if (connection) await connection.release();
    }
});

//RETRIEVE
exports.getChecklist = catchAsync(async (req, res) => {
    const card_id = req.params.card_id

    const [result] = await db.query('SELECT * FROM checklist WHERE card_id = ? ORDER BY checklist_position ASC',
        [card_id]
    );

    if (result.length === 0) {
        return res.json({ message: "Checklist Items were Retrieved", checklists: result })
    }

    const checklist_ids = result.map(c => c.checklist_id);

    const itemMap = new Map();

    if (checklist_ids.length > 0) {
        const [items] = await db.query('SELECT * FROM checklist_items WHERE checklist_id IN (?) ORDER BY item_position ASC',
            [checklist_ids]
        )

        items.forEach(item => {
            if (!itemMap.has(item.checklist_id)) {
                itemMap.set(item.checklist_id, []);
            }
            itemMap.get(item.checklist_id).push(item);
        })
    }

    result.forEach(checklist => {
        checklist.items = itemMap.get(checklist.checklist_id) || [];
    })

    res.json({ message: "Checklist Items were Retrieved!", checklists: result })
});

//-----ITEM (CHECKLIST) HANDLING-----\\
// DO REFRESH FOR DELETE

//CREATE
exports.addItem = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const card_id = req.params.card_id || req.body.card_id;
        const { checklist_id, item_text, item_position, due_date, due_time } = req.body;

        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO checklist_items (checklist_id, item_text, item_position, due_date, due_time) VALUES (?, ?, ?, ?, ?)',
            [checklist_id, item_text, item_position, due_date, due_time]
        )

        const item_id = result.insertId;

        const [item] = await connection.query('SELECT * FROM checklist_items WHERE item_id = ?',
            [item_id]
        )

        if (item.length === 0) {
            await connection.rollback();
            return res.status(403).json({ message: "Unable to Find Item" });
        }

        const actor = await messageHandler.getUser(req.session.user.user_id);

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, board_id, card_id, 'ADDED_ITEM', JSON.stringify({ user: actor.user_name, item: item[0].item_text })]
        )

        await connection.commit();

        emitBoard(req, board_id, 'item:created', { item: item[0] });
        res.json({ message: "Checklist Item Created Successfully!", item: item[0] })
    } finally { if (connection) await connection.release() }
});

//PATCH/UPDATE
exports.updateItem = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const card_id = req.params.card_id || req.body.card_id;
        const item_id = req.params.item_id || req.body.item_id;
        const { item_text, item_position, due_date, due_time, is_completed } = req.body;

        await connection.beginTransaction();

        const [getItem] = await connection.query('SELECT * FROM checklist_items WHERE item_id = ?',
            [item_id]
        )

        if (getItem.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Item Not Found!" })
        }

        const updatedText = item_text && item_text.trim() !== '' ? item_text : getItem[0].item_text;
        const updatedPosition = item_position !== undefined && item_position !== null ? item_position : getItem[0].item_position;
        const updatedDate = due_date !== undefined && due_date !== null ? due_date : getItem[0].due_date;
        const updatedTime = due_time !== undefined && due_time !== null ? due_time : getItem[0].due_time;
        const updatedCompleted = is_completed !== undefined && is_completed !== null ? is_completed : getItem[0].is_completed;

        await connection.query('UPDATE checklist_items SET item_text = ?, item_position = ?, due_date = ?, due_time = ?, is_completed = ? WHERE item_id = ?',
            [updatedText, updatedPosition, updatedDate, updatedTime, updatedCompleted, item_id]
        )

        if (Number(updatedCompleted) === 1 && Number(getItem[0].is_completed) !== 1) {
            const actor = await messageHandler.getUser(req.session.user.user_id);

            await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
                [actor.user_id, board_id, card_id, 'COMPLETED_ITEM', JSON.stringify({ user: actor.user_name, item: updatedText })]
            )
        }

        await connection.commit();

        emitBoard(req, board_id, 'item:updated', { item_id, changes: { updatedText, updatedCompleted } });
        res.json({ message: "Checklist Item Patched Successfully!" });
    } finally { if (connection) await connection.release() }
});

//DELETE
exports.removeItem = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const item_id = req.params.item_id || req.body.item_id;

        await connection.beginTransaction();

        await connection.query('DELETE FROM checklist_items WHERE item_id = ?',
            [item_id]
        )

        await connection.commit();

        emitBoard(req, board_id, 'item:deleted', { item_id });
        res.json({ message: "Checklist Item was Deleted Successfully!" });
    } finally { if (connection) await connection.release() }
});

//-----ATTACHMENT HANDLING-----\\
// REFRESH

async function cleanupFile(filePath = []) {
    for (const file of filePath) {
        try {
            await fs.unlink(file);
        } catch {
            console.error('Clean-up failed:', file);
        }
    }
}

exports.addAttachment = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const card_id = req.params.card_id || req.body.card_id;
        const list_id = req.params.list_id || req.body.list_id;
        const user_id = req.session.user.user_id;
        let { external_url, attachment_type } = req.body;

        let filePath = null;
        let attachment_name = null;
        let mimeType = null;
        let fileSize = null;
        let attachmentType = req.file ? 'file' : (external_url ? 'link' : attachment_type || 'file');

        if (req.file) {
            attachment_name = req.file.originalname;
            filePath = `attachment/attachment-${card_id}/${req.file.filename}`;
            mimeType = req.file.mimetype;
            fileSize = req.file.size;
            attachmentType = 'file';
        } else if (external_url) {
            attachment_name = external_url;
            attachmentType = 'link';
        } else {
            return res.status(400).json({ message: "None Media Provided!" });
        }

        await connection.beginTransaction();

        await connection.query('INSERT INTO attachments (board_id, list_id, card_id, attachment_name, file_path, external_url, attachment_type, mime_type, file_size, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [board_id, list_id, card_id, attachment_name, filePath, external_url, attachmentType, mimeType, fileSize, user_id]
        );

        const actor = await messageHandler.getUser(req.session.user.user_id);

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, board_id, card_id, 'ATTACHMENT_ADDED', JSON.stringify({ user: actor.user_name, attachment: attachment_name })]
        )

        await connection.commit();

        emitBoard(req, board_id, 'attachment:added', { card_id, attachment_name });
        res.json({ message: "Media Attached Successfully!" });
    } finally { if (connection) await connection.release() }
});

exports.editAttachment = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const attachment_id = req.params.attachment_id || req.body.attachment_id;
        const { attachment_name, external_url } = req.body;

        await connection.beginTransaction();

        const [attachments] = await connection.query('SELECT * FROM attachments WHERE attachment_id = ?',
            [attachment_id]
        );

        if (attachments.length === 0) {
            await connection.rollback()
            return res.status(404).json({ message: "Attachment Not Found!" });
        }

        if (req.file) {
            external_url = null;
        } else if (external_url) {
            attachment_name = attachment_name || external_url;
            external_url = external_url;
        } else {
            return res.status(400).json({ message: "None Media Provided!" });
        }

        await connection.query('UPDATE attachments SET attachment_name = ?, external_url = ? WHERE attachment_id = ?',
            [attachment_name, external_url, attachment_id]
        );

        // NOTE: UPDATE ONLY NAME AND URL BUT NO MOVE ATTACHMENT FEATURE

        emitBoard(req, board_id, 'attachment:updated', { attachment_id, attachment_name });
        await connection.commit();

        res.json({ message: "Attachment Edited Successfully!" });
    } finally { if (connection) await connection.release() }
});

exports.removeAttachment = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const card_id = req.params.card_id || req.body.card_id;
        const attachment_id = req.params.attachment_id || req.body.attachment_id;

        await connection.beginTransaction();

        const [attachments] = await connection.query('SELECT * FROM attachments WHERE attachment_id = ?',
            [attachment_id]
        );

        if (attachments.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Attachment Not Found!" });
        }

        const attachment_name = attachments[0].attachment_name

        await connection.query('DELETE FROM attachments WHERE attachment_id = ?',
            [attachment_id]
        )

        const actor = await messageHandler.getUser(req.session.user.user_id);

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, board_id, card_id, 'ATTACHMENT_REMOVED', JSON.stringify({ user: actor.user_name, attachment: attachment_name })]
        )

        await connection.commit();

        const filePath = attachments[0].file_path;
        if (filePath) {
            const fullPath = path.join(__dirname, '../public', filePath);
            fs.unlink(fullPath)
                .catch(err => console.error('Attachment File Deletion Failed:', err));
        }

        emitBoard(req, board_id, 'attachment:removed', { attachment_id });
        res.json({ message: "Attachment was Deleted Successfully!" });
    } finally { if (connection) await connection.release() }
});

//-----ARCHIVE-----\\

exports.archiveList = catchAsync(async (req, res) => {
    const board_id = req.params.board_id || req.body.board_id;
    const list_id = req.params.list_id || req.body.list_id;
    const { is_archived } = req.body;

    await db.query('UPDATE list SET is_archived = ? WHERE list_id = ?',
        [is_archived, list_id]
    );

    const [list] = await db.query('SELECT * FROM list WHERE list_id = ?',
        [list_id]
    );

    const event = is_archived ? 'list:archived' : 'list:unarchived';

    emitBoard(req, board_id, event, { list: list[0] });
    res.json({ message: is_archived ? 'List Archived.' : 'List Unarchived.', list: list[0] });
});

exports.getArchivedList = catchAsync(async (req, res) => {
    const board_id = req.params.board_id || req.body.board_id;

    const [result] = await db.query('SELECT * FROM list WHERE board_id = ? AND is_archived = 1',
        [board_id]
    )

    res.json({ message: "Archived Lists were Retrieved.", archived: result });
})

exports.archiveCard = catchAsync(async (req, res) => {
    const board_id = req.params.board_id || req.body.board_id;
    const card_id = req.params.card_id || req.body.card_id;
    const { is_archived } = req.body;

    await db.query('UPDATE card SET is_archived = ? WHERE card_id = ?',
        [is_archived, card_id]
    );

    const [card] = await db.query('SELECT * FROM card WHERE card_id = ?',
        [card_id]
    );

    const event = is_archived ? 'card:archived' : 'card:unarchived';

    emitBoard(req, board_id, event, { card: card[0] });
    res.json({ message: is_archived ? 'Card Archived.' : 'Card Unarchived.', card: card[0] });
});


exports.getArchivedCard = catchAsync(async (req, res) => {
    const board_id = req.params.board_id || req.body.board_id;

    const [result] = await db.query('SELECT t1.* FROM card AS t1 JOIN list AS t2 ON t1.list_id = t2.list_id WHERE t2.board_id = ? AND t1.is_archived = 1',
        [board_id]
    )

    res.json({ message: "Archived Cards were Retrieved.", archived: result });
})

//-----MISCALLANEOUS FEATURES-----\\

exports.getActivityLogs = catchAsync(async (req, res) => {
    const card_id = req.params.card_id || req.body.card_id;

    const [result] = await db.query('SELECT * FROM card WHERE card_id = ?',
        [card_id]
    );

    if (result.length === 0) {
        return res.status(404).json({ message: "Card Not Found!" });
    }

    const [activity_logs] = await db.query('SELECT t1.* FROM activity_logs AS t1 WHERE card_id = ?',
        [card_id]
    )

    for (const log of activity_logs) {
        log.message = messageHandler.buildActivity(log)
    }

    res.json({ message: "User's Activity Logs were Retrieved!", activity_logs: activity_logs })
});

//REFRESH UNLESS DIFFERENT BOARD/LIST
exports.moveCard = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const card_id = req.params.card_id || req.body.card_id;
        const { new_list_id, new_position } = req.body;

        await connection.beginTransaction();

        const [cardResult] = await connection.query('SELECT list_id, card_position FROM card WHERE card_id = ?',
            [card_id]
        )

        if (cardResult.length === 0) {
            await connection.rollback()
            return res.status(404).json({ message: "Card Not Found!" });
        }

        await connection.query('UPDATE card SET list_id = ?, card_position = ? WHERE card_id = ?',
            [new_list_id, new_position, card_id]
        );

        await connection.query('UPDATE attachments SET list_id = ? WHERE card_id = ?',
            [new_list_id, card_id]
        );

        const [AList] = await connection.query('SELECT * FROM list WHERE list_id = ?',
            [cardResult[0].list_id]
        )

        const [BList] = await connection.query('SELECT * FROM list WHERE list_id = ?',
            [new_list_id]
        )

        const actor = await messageHandler.getUser(req.session.user.user_id);

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, board_id, card_id, 'MOVED_CARD', JSON.stringify({ user: actor.user_name, beforeList: AList[0].list_name, afterList: BList[0].list_name })]
        )

        await connection.commit();

        emitBoard(req, board_id, 'card:moved', { card_id, from_list: cardResult[0].list_id, to_list: new_list_id, position: new_position });
        res.json({ message: "Card Moved Successfully!" });
    } finally { if (connection) await connection.release() }
});

// REFRESH UNLESS DIFFERENT BOARD/LIST
exports.duplicateCard = catchAsync(async (req, res) => {
    let connection;

    const duplicatedFiles = [];

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const card_id = req.params.card_id || req.body.card_id;
        const user_id = req.session.user.user_id;
        const { new_board_id, new_list_id, new_position } = req.body;

        await connection.beginTransaction();

        const [board] = await connection.query('SELECT board_title FROM board WHERE board_id = ?',
            [board_id]
        )

        if (board.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Board Not Found!" });
        }

        const [boardMembers] = await connection.query('SELECT user_id FROM board_user WHERE board_id = ?',
            [board_id]
        );

        const boardMemberSet = new Set(boardMembers.map(u => u.user_id));

        const [exist] = await connection.query('SELECT t1.* FROM list AS t1 JOIN board AS t2 ON t1.board_id = t2.board_id WHERE t2.board_id = ? AND t1.list_id = ?',
            [new_board_id, new_list_id]
        )

        if (exist.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Nonexisting Object Upon Card Duplication!" });
        }

        const [cardResult] = await connection.query('SELECT * FROM card WHERE card_id = ?',
            [card_id]
        )

        if (cardResult.length === 0) {
            await connection.rollback()
            return res.status(404).json({ message: "Card Not Found!" });
        }

        const card = cardResult[0];

        const [dupCard] = await connection.query('INSERT INTO card (card_name, card_description, card_position, due_date, due_time, list_id, completed) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [card.card_name, card.card_description, new_position, card.due_date, card.due_time, new_list_id, card.completed]
        )

        const new_card_id = dupCard.insertId

        const [attachments] = await connection.query('SELECT * FROM attachments WHERE card_id = ?',
            [card_id]
        );

        if (attachments.length > 0) {
            for (const attachment of attachments) {
                let newFilePath = null;

                if (attachment.attachment_type === 'file' && attachment.file_path) {
                    newFilePath = await duplicateAttachmentFile(attachment.file_path, new_card_id);
                    duplicatedFiles.push(newFilePath);
                }

                await connection.query('INSERT INTO attachments (board_id, list_id, card_id, attachment_name, file_path, external_url, attachment_type, mime_type, file_size, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [new_board_id, new_list_id, new_card_id, attachment.attachment_name, newFilePath, attachment.external_url, attachment.attachment_type, attachment.mime_type, attachment.file_size, user_id]
                );
            }
        }

        const [checklist] = await connection.query('SELECT * FROM checklist WHERE card_id = ?',
            [card_id]
        );

        if (checklist.length > 0) {
            for (const chgroup of checklist) {
                const [newChecklist] = await connection.query('INSERT INTO checklist (card_id, checklist_title, checklist_position) VALUES (?, ?, ?)',
                    [new_card_id, chgroup.checklist_title, chgroup.checklist_position]
                );

                const new_checklist_id = newChecklist.insertId;

                const [items] = await connection.query('SELECT * FROM checklist_items WHERE checklist_id = ?',
                    [chgroup.checklist_id]
                );

                for (const item of items) {
                    const [newItem] = await connection.query('INSERT INTO checklist_items (checklist_id, item_text, is_completed) VALUES (?, ?, ?)',
                        [new_checklist_id, item.item_text, item.is_completed]
                    );

                    const new_item_id = newItem.insertId;

                    const [assignedUsers] = await connection.query('SELECT user_id FROM assigned_checklist WHERE item_id = ?',
                        [item.item_id]
                    );

                    for (const au of assignedUsers) {
                        if (boardMemberSet.has(au.user_id)) {
                            await connection.query('INSERT INTO assigned_checklist (item_id, user_id) VALUES (?, ?)',
                                [new_item_id, au.user_id]
                            );
                        }
                    }
                }
            }
        }

        const [labels] = await connection.query('SELECT label_id FROM card_labels WHERE card_id = ?',
            [card_id]
        );

        for (const lbl of labels) {
            await connection.query('INSERT INTO card_labels (card_id, label_id) VALUES (?, ?)',
                [new_card_id, lbl.label_id]
            );
        };

        const [members] = await connection.query('SELECT t1.user_id FROM card_member AS t1 JOIN board_user AS t2 ON t1.user_id = t2.user_id WHERE t1.card_id = ? AND t2.board_id = ?',
            [card_id, new_board_id]
        );

        if (members.length > 0) {
            for (const member of members) {
                await connection.query(
                    'INSERT INTO card_member (card_id, user_id) VALUES (?, ?)',
                    [new_card_id, member.user_id]
                );
            }
        }

        const actor = await messageHandler.getUser(user_id, connection);

        const list_name = exist[0].list_name;
        const board_title = board[0].board_title;

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, new_board_id, new_card_id, 'COPIED_CARD', JSON.stringify({ user: actor.user_name, board: board_title, list: list_name })]
        )

        await connection.commit();

        emitBoard(req, new_board_id, 'card:duplicated', { new_card_id });
        res.json({ message: "Card Duplicated Successfully!" });
    } catch (err) {
        if (connection) {
            await connection.rollback();
        }

        for (const filePath of duplicatedFiles) {
            try {
                const fullPath = path.join(__dirname, '../public', filePath);
                await fs.unlink(fullPath);
            } catch (cleanupError) {
                console.error('Failed to Clean up Duplicated File:', filePath, cleanupError);
            }
        }

        throw err;
    } finally { if (connection) await connection.release() }
})

// REFRESH UNLESS DIFFERENT BOARD/LIST
exports.duplicateList = catchAsync(async (req, res) => {
    let connection;

    const duplicatedFiles = [];

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const list_id = req.params.list_id || req.body.list_id;
        const user_id = req.session.user.user_id

        await connection.beginTransaction();

        const [boardResult] = await connection.query('SELECT * FROM board WHERE board_id = ?',
            [board_id]
        );

        if (boardResult.length === 0) {
            await connection.rollback()
            return res.status(404).json({ message: "Board Not Found!" });
        }

        const [listResult] = await connection.query('SELECT * FROM list WHERE list_id = ?',
            [list_id]
        );

        if (listResult.length === 0) {
            await connection.rollback()
            return res.status(404).json({ message: "List Not Found!" });
        }

        const [boardMembers] = await connection.query('SELECT user_id FROM board_user WHERE board_id = ?',
            [listResult[0].board_id]
        );

        const boardMemberSet = new Set(boardMembers.map(u => u.user_id));

        if (board_id === listResult[0].board_id) {
            await connection.query('UPDATE list SET list_position = list_position + 1 WHERE board_id = ? AND list_position > ?',
                [listResult[0].board_id, listResult[0].list_position]
            );
        } else {
            const [checkMembers] = await connection.query('SELECT * FROM board_user WHERE board_id = ?',
                [board_id]
            )

            if (checkMembers.length > 0) {
                for (const nbm of checkMembers) {
                    if (!boardMemberSet.has(nbm.user_id)) {
                        await connection.query('INSERT INTO board_user (board_id, user_id, role) VALUES (?, ?, ?)',
                            [board_id, nbm.user_id, nbm.role]
                        )
                    }
                }
            }
        }

        const [result] = await connection.query('INSERT INTO list (board_id, list_name, list_position) VALUES (?, ?, ?)',
            [board_id, `${listResult[0].list_name} (Copy)`, listResult[0].list_position + 1]
        );

        const new_list_id = result.insertId;

        const [cards] = await connection.query('SELECT * FROM card WHERE list_id = ?',
            [list_id]
        );

        for (const card of cards) {
            const [newCardResult] = await connection.query('INSERT INTO card (list_id, card_name, card_description, card_position, due_date, due_time) VALUES (?, ?, ?, ?, ?, ?)',
                [new_list_id, card.card_name, card.card_description, card.card_position, card.due_date, card.due_time]
            );

            const new_card_id = newCardResult.insertId;

            const [attachments] = await connection.query('SELECT * FROM attachments WHERE card_id = ?',
                [card.card_id]
            );

            if (attachments.length > 0) {
                for (const attachment of attachments) {
                    let newFilePath = null;

                    if (attachment.attachment_type === 'file' && attachment.file_path) {
                        newFilePath = await duplicateAttachmentFile(attachment.file_path, new_card_id);
                        duplicatedFiles.push(newFilePath);
                    }

                    await connection.query(
                        'INSERT INTO attachments (board_id, list_id, card_id, attachment_name, file_path, external_url, attachment_type, mime_type, file_size, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [board_id, new_list_id, new_card_id, attachment.attachment_name, newFilePath, attachment.external_url, attachment.attachment_type, attachment.mime_type, attachment.file_size, user_id]
                    );
                }
            }

            const [checklist] = await connection.query('SELECT * FROM checklist WHERE card_id = ?',
                [card.card_id]
            );

            if (checklist.length > 0) {
                for (const chgroup of checklist) {
                    const [newChecklist] = await connection.query('INSERT INTO checklist (card_id, checklist_title, checklist_position) VALUES (?, ?, ?)',
                        [new_card_id, chgroup.checklist_title, chgroup.checklist_position]
                    );

                    const new_checklist_id = newChecklist.insertId;

                    const [items] = await connection.query('SELECT * FROM checklist_items WHERE checklist_id = ?',
                        [chgroup.checklist_id]
                    );

                    for (const item of items) {
                        const [newItem] = await connection.query('INSERT INTO checklist_items (checklist_id, item_text, is_completed) VALUES (?, ?, ?)',
                            [new_checklist_id, item.item_text, item.is_completed]
                        );

                        const new_item_id = newItem.insertId;

                        const [assignedUsers] = await connection.query('SELECT user_id FROM assigned_checklist WHERE item_id = ?',
                            [item.item_id]
                        );

                        for (const au of assignedUsers) {
                            if (boardMemberSet.has(au.user_id)) {
                                await connection.query('INSERT INTO assigned_checklist (item_id, user_id) VALUES (?, ?)',
                                    [new_item_id, au.user_id]
                                );
                            }
                        }
                    }
                }
            }

            const [labels] = await connection.query('SELECT t1.label_id, t2.label_color, t2.label_name FROM card_labels AS t1 JOIN labels AS t2 ON t1.label_id = t2.label_id WHERE t1.card_id = ?',
                [card.card_id]
            );

            for (const lbl of labels) {
                let target_label_id;

                if (board_id === listResult[0].board_id) {
                    target_label_id = lbl.label_id;
                } else {
                    const [existingLabel] = await connection.query('SELECT label_id FROM labels WHERE board_id = ? AND label_color = ?',
                        [board_id, lbl.label_color]
                    );

                    if (existingLabel.length > 0) {
                        target_label_id = existingLabel[0].label_id;
                    } else {
                        const [newLabel] = await connection.query('INSERT INTO labels (board_id, label_color, label_name) VALUES (?, ?, ?)',
                            [board_id, lbl.label_color, lbl.label_name]
                        );
                        target_label_id = newLabel.insertId;
                    }
                }

                await connection.query('INSERT INTO card_labels (card_id, label_id) VALUES (?, ?)',
                    [new_card_id, target_label_id]
                );
            }

            const [members] = await connection.query('SELECT t1.user_id FROM card_member AS t1 JOIN board_user AS t2 ON t1.user_id = t2.user_id WHERE t1.card_id = ? AND t2.board_id = ?',
                [card.card_id, listResult[0].board_id]
            );

            if (members.length > 0) {
                for (const member of members) {
                    await connection.query('INSERT INTO card_member (card_id, user_id) VALUES (?, ?)',
                        [new_card_id, member.user_id]
                    );
                }
            }

            const actor = await messageHandler.getUser(user_id, connection);

            const list_name = listResult[0].list_name;
            const board_title = boardResult[0].board_title;

            await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
                [actor.user_id, listResult[0].board_id, new_card_id, 'COPIED_CARD', JSON.stringify({ user: actor.user_name, board: board_title, list: list_name })]
            )
        }

        await connection.commit();
        res.json({ message: "List Duplicated Successfully!" });
    } catch (err) {
        if (connection) {
            await connection.rollback();
        }

        for (const filePath of duplicatedFiles) {
            try {
                const fullPath = path.join(__dirname, '../public', filePath);
                await fs.unlink(fullPath);
            } catch (cleanupError) {
                console.error('Failed to Clean up Duplicated File:', filePath, cleanupError);
            }
        }

        throw err;
    } finally { if (connection) await connection.release() }
});

// REFRESH
exports.moveList = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const target_board_id = req.params.board_id || req.body.board_id;
        const list_id = req.params.list_id || req.body.list_id;
        const user_id = req.session.user.user_id;

        await connection.beginTransaction();

        const [boardResult] = await connection.query('SELECT * FROM board WHERE board_id = ?',
            [target_board_id]
        );

        if (boardResult.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Target Board Not Found!" });
        }

        const [listResult] = await connection.query('SELECT * FROM list WHERE list_id = ?',
            [list_id]
        );

        if (listResult.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "List Not Found!" });
        }

        const original_board_id = listResult[0].board_id;

        if (target_board_id === original_board_id) {
            await connection.rollback();
            return res.json({ message: "List is already on this board!" });
        }

        const [maxPosition] = await connection.query('SELECT MAX(list_position) as max_pos FROM list WHERE board_id = ?',
            [target_board_id]
        );

        const new_position = (maxPosition[0].max_pos || 0) + 1;

        await connection.query('UPDATE list SET board_id = ?, list_position = ? WHERE list_id = ?',
            [target_board_id, new_position, list_id]
        );

        await connection.query('UPDATE list SET list_position = list_position - 1 WHERE board_id = ? AND list_position > ?',
            [original_board_id, listResult[0].list_position]
        );

        const [cards] = await connection.query('SELECT card_id FROM card WHERE list_id = ?',
            [list_id]
        );

        if (cards.length > 0) {
            const card_ids = cards.map(c => c.card_id);
            await connection.query(`UPDATE attachments SET board_id = ? WHERE card_id IN (${card_ids.map(() => '?').join(',')})`,
                [target_board_id, ...card_ids]
            );
        }

        for (const card of cards) {
            const [cardLabels] = await connection.query('SELECT t1.label_id, t2.label_color, t2.label_name FROM card_labels AS t1 JOIN labels AS t2 ON t1.label_id = t2.label_id WHERE t1.card_id = ?',
                [card.card_id]
            );

            if (cardLabels.length > 0) {
                await connection.query('DELETE FROM card_labels WHERE card_id = ?',
                    [card.card_id]
                );

                for (const lbl of cardLabels) {
                    const [existingLabel] = await connection.query('SELECT label_id FROM labels WHERE board_id = ? AND label_color = ?',
                        [target_board_id, lbl.label_color]
                    );

                    let target_label_id;

                    if (existingLabel.length > 0) {
                        target_label_id = existingLabel[0].label_id;
                    } else {
                        const [newLabel] = await connection.query('INSERT INTO labels (board_id, label_color, label_name) VALUES (?, ?, ?)',
                            [target_board_id, lbl.label_color, lbl.label_name]
                        );
                        target_label_id = newLabel.insertId;
                    }

                    await connection.query('INSERT INTO card_labels (card_id, label_id) VALUES (?, ?)',
                        [card.card_id, target_label_id]
                    );
                }
            }
        }

        const actor = await messageHandler.getUser(user_id, connection);
        const list_name = listResult[0].list_name;
        const board_title = boardResult[0].board_title;

        await connection.commit();

        emit.emitToBoard(req, original_board_id, 'list:moved-out', { list_id, to_board_id: target_board_id });

        emit.emitToBoard(req, target_board_id, 'list:moved-in', { list_id, from_board_id: original_board_id, new_position });
        res.json({ message: "List Moved Successfully!" });
    } finally { if (connection) await connection.release() }
});

exports.convertCard = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, item_id } = req.params;

        await connection.beginTransaction();

        const [itemData] = await connection.query(`SELECT t1.item_id, t1.item_text, t1.due_date, t1.due_time, t3.list_id, t4.board_id FROM checklist_items AS t1 JOIN checklist AS t2 ON t1.checklist_id = t2.checklist_id JOIN card AS t3 ON t2.card_id = t3.card_id JOIN list AS t4 ON t3.list_id = t4.list_id WHERE t1.item_id = ? AND t4.board_id = ?`,
            [item_id, board_id]
        );

        if (itemData.length === 0) {
            await connection.rollback()
            return res.status(404).json({ message: "Checklist Item Not Found!" });
        }

        const checklistItem = itemData[0];

        const [positionResult] = await connection.query(
            'SELECT MAX(card_position) as max_position FROM card WHERE list_id = ?',
            [checklistItem.list_id]
        );

        const lastPosition = positionResult[0].max_position || 0;

        await connection.query('INSERT INTO card (list_id, card_name, card_description, card_position, due_date, due_time) VALUES (?, ?, ?, ?, ?, ?)',
            [checklistItem.list_id, checklistItem.item_text, '', lastPosition + 1, checklistItem.due_date, checklistItem.due_time]
        );

        await connection.commit();

        emit.emitToBoard(req, board_id, 'card:created', { list_id: checklistItem.list_id, card: { card_name: checklistItem.item_text, due_date: checklistItem.due_date, due_time: checklistItem.due_time } });
        res.json({ message: "Checklist Item Converted to Card Successfully!" });
    } finally { if (connection) await connection.release() }
});

exports.userCard = catchAsync(async (req, res) => {
    const user_id = req.session.user.user_id

    const [result] = await db.query('SELECT t1.card_id, t1.card_name, t1.completed, t1.due_date, t1.due_time, t2.list_id, t2.list_name, t3.board_title, t3.board_id FROM card AS t1 JOIN list AS t2 ON t1.list_id = t2.list_id JOIN board AS t3 ON t2.board_id = t3.board_id JOIN card_member AS t4 ON t1.card_id = t4.card_id WHERE t4.user_id = ? ORDER BY t3.board_id ASC',
        [user_id]
    );

    if (result.length === 0) {
        return res.json({ message: "Retrieved User's Cards!", cards: [] })
    }

    const card_ids = result.map(c => c.card_id);

    const labelMap = new Map();

    const [labels] = await db.query('SELECT t1.card_id, t2.* FROM card_labels AS t1 JOIN labels AS t2 ON t1.label_id = t2.label_id WHERE t1.card_id = ?',
        [card_ids]
    );

    labels.forEach(label => {
        if (!labelMap.has(label.card_id)) {
            labelMap.set(label.card_id, []);
        }

        labelMap.get(label.card_id).push(label);
    })

    result.forEach(card => {
        card.labels = labelMap.get(card.card_id) || [];
    })

    return res.json({ message: "Retrieved User's Cards!", cards: result })
})

exports.userActivity = catchAsync(async (req, res) => {
    const user_id = req.session.user.user_id;

    const [result] = await db.query('SELECT t1.*, t2.board_id, t2.board_title, t3.user_name, t3.user_img_path FROM activity_logs AS t1 JOIN board AS t2 ON t1.board_id = t2.board_id JOIN user AS t3 ON t1.user_id = t3.user_id WHERE t1.user_id = ? ORDER BY t1.created_at DESC',
        [user_id]
    )

    if (result.length === 0) {
        return res.json({ message: "Retrieved User's Activity", activity_logs: [] })
    }

    for (const log of result) {
        log.message = messageHandler.buildActivity(log)
    }

    res.json({ message: "Retrieved User's were Retrieved!", activity_logs: result })
})