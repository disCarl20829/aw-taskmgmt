const db = require('../db');
const bcrypt = require('bcrypt');

const catchAsync = require('../middleware/catch.middleware');
const messageHandler = require('../utilities/message.handler');
const emit = require('../utilities/socket');

exports.terminate = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const user_id = req.session.user.user_id || req.body.user_id;

        if (user_id !== req.session.user.user_id) {
            return res.status(403).json({ message: "Unauthorized Action: Cannot Delete Account." });
        }

        await connection.beginTransaction();

        await connection.query("DELETE FROM user WHERE user_id = ?",
            [user_id]
        );

        await connection.commit();

        req.session.destroy();

        res.json({ message: "Successfully Terminated User!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Termination Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

exports.update = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const user_id = req.session.user?.user_id;

        if (!user_id) {
            return res.status(401).json({ message: "Unauthorized: Please log in." });
        }

        const { user_img_path, user_email, user_name, user_password } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query("SELECT user_name, user_email, user_img_path FROM user WHERE user_id = ?",
            [user_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User Not Found!" });
        }

        const updatedName = user_name && user_name.trim() !== '' ? user_name : row[0].user_name;
        const updatedEmail = user_email && user_email.trim() !== '' ? user_email : row[0].user_email;
        const updatedImgPath = user_img_path && user_img_path.trim() !== '' ? user_img_path : row[0].user_img_path;

        await connection.query("UPDATE user SET user_name = ?, user_email = ?, user_img_path = ? WHERE user_id = ?",
            [updatedName, updatedEmail, updatedImgPath, user_id]
        );

        if (user_password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(user_password.trim(), saltRounds);

            await connection.query("UPDATE user SET user_password = ? WHERE user_id = ?",
                [hashedPassword, user_id]
            );
        }

        await connection.commit();

        req.session.user = {
            user_id: user_id,
            user_name: updatedName,
            user_email: updatedEmail,
            user_img_path: updatedImgPath
        };

        res.json({ message: "Your Information was Successfully Updated!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Update Failed: ", error: err.message });
    } finally { if (connection) await connection.release() }
}

exports.changeAccess = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const session_user_id = req.session.user.user_id;
        const { user_id } = req.body;

        await connection.beginTransaction();

        const [adminCheck] = await connection.query("SELECT user_access FROM user WHERE user_id = ? AND user_access = 1",
            [session_user_id]
        );

        if (adminCheck.length === 0) {
            await connection.rollback();
            return res.status(401).json({ message: "Unauthorized Action!" });
        }

        const [target] = await connection.query("SELECT user_access FROM user WHERE user_id = ?",
            [user_id]
        );

        if (target.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        const currentAccess = target[0].user_access;
        if (currentAccess === 1) {
            await connection.rollback();
            return res.status(403).json({ message: "Admins cannot change other admins' roles" });
        }
        
        const newAccess = 1;
        await connection.query("UPDATE user SET user_access = ? WHERE user_id = ?",
            [newAccess, user_id]
        );

        await connection.commit();

        emit.toBoard(req, "access:updated", { user_id, user_access: newAccess });

        res.json({
            message: "User access updated",
            user_id,
            user_access: newAccess,
        });
    } finally {
        if (connection) await connection.release();
    }
});


exports.searchUser = catchAsync(async (req, res) => {
    const bar = req.body.bar ?? "";
    const search = `%${bar}%`;

    const [result] = await db.query("SELECT user_id, user_name, user_email, user_img_path FROM user WHERE user_name LIKE ? OR user_email LIKE ?",
        [search, search]
    )

    res.json({ message: "Successfully Retrieved User(s)!", users: result });
});

exports.searchAll = catchAsync(async (req, res) => {
    const user_id = req.session.user.user_id

    const [result] = await db.query("SELECT user_id, user_name, user_email, user_img_path, user_access, CASE WHEN user_id = ? THEN true ELSE false END as isUser FROM user",
        [user_id]
    );

    res.json({ message: "Successfully Retrieved Users!", users: result });
});

exports.searchByBoard = catchAsync(async (req, res) => {
    const board_id = req.params.board_id || req.body.board_id;
    const bar = req.body.bar ?? "";

    const search = `%${bar}%`;

    const [result] = await db.query('SELECT DISTINCT t1.user_id, t1.user_name, t1.user_email, t1.user_img_path, t1.user_access, CASE WHEN t2.user_id IS NOT NULL THEN true ELSE false END AS isBoard FROM user AS t1 LEFT JOIN board_user AS t2 ON t1.user_id = t2.user_id AND t2.board_id = ? WHERE (t1.user_name LIKE ? OR t1.user_email LIKE ?) AND t2.board_id = ?',
        [board_id, search, search, board_id]
    );

    res.json({ message: "Successfully Retrieved Users!", users: result });
});

exports.searchByCard = catchAsync(async (req, res) => {
    const { card_id } = req.params;
    const bar = req.body.bar ?? '';

    const search = `%${bar}%`;

    const [result] = await db.query('SELECT DISTINCT t1.user_id, t1.user_name, t1.user_email, t1.user_img_path, t1.user_access, CASE WHEN t2.user_id IS NOT NULL THEN true ELSE false END AS isCard FROM user AS t1 LEFT JOIN card_member AS t2 ON t1.user_id = t2.user_id AND t2.card_id = ? WHERE (t1.user_name LIKE ? OR t1.user_email LIKE ?) AND t2.card_id = ?',
        [card_id, search, search, card_id]
    );

    res.json({ message: "Successfully Retrieved Card Members", users: result });
});

exports.searchByChecklist = catchAsync(async (req, res) => {
    const { item_id } = req.params;
    const bar = req.body.bar ?? '';

    const search = `%${bar}%`;

    const [result] = await db.query('SELECT DISTINCT t1.user_id, t1.user_name, t1.user_email, t1.user_img_path, t1.user_access, CASE WHEN t2.user_id IS NOT NULL THEN true ELSE false END AS isAssigned FROM user AS t1 LEFT JOIN assigned_checklist AS t2 ON t1.user_id = t2.user_id AND t2.item_id = ? WHERE (t1.user_name LIKE ? OR t1.user_email LIKE ?) AND t2.item_id = ?',
        [item_id, search, search, item_id]
    );

    res.json({ message: "Successfully Retrieved Assigned Checklist", users: result });
});

//-----BOARD MEMBER-----\\

//ADD
exports.addBoardMember = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id } = req.params;
        const { user_id } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT 1 FROM board_user WHERE board_id = ? AND user_id = ? LIMIT 1',
            [board_id, user_id]
        );

        if (row.length !== 0) {
            await connection.rollback();
            return res.status(403).json({ message: "User Already has Access to this Board!" });
        }

        await connection.query('INSERT INTO board_user (board_id, user_id, role) VALUES (?, ?, ?)',
            [board_id, user_id, 'editor']
        );

        const [newCol] = await connection.query('SELECT * FROM board_user WHERE board_id = ? AND user_id = ?',
            [board_id, user_id]
        );

        const [board] = await connection.query('SELECT board_title FROM board WHERE board_id = ?',
            [board_id]
        );

        const actor = await messageHandler.getUser(req.session.user.user_id);

        req.mail = {
            user_id, title: "Board Invitation", message: `${actor.user_name} added you to the board "${board[0].board_title}".`
        };

        await connection.commit();

        emit.toBoard(board_id, 'board-member-added', { board_id, user: newCol[0] });
        res.json({ message: "User Successfully Added to Board!", user: newCol[0] });
    } finally {
        if (connection) await connection.release();
    }
});

//UPDATE
exports.modifyBoardMember = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id } = req.params;
        const { user_id, role } = req.body;

        await connection.beginTransaction();

        const [result] = await connection.query('UPDATE board_user SET role = ? WHERE board_id = ? AND user_id = ?',
            [role, board_id, user_id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User is Not a Member of this board" });
        }

        const [newCol] = await connection.query('SELECT * FROM board_user WHERE board_id = ? AND user_id = ?',
            [board_id, user_id]
        )

        await connection.commit();

        emit.toBoard(board_id, 'board-member-updated', { board_id, user: newCol[0] });
        res.json({ message: "User's Access was Changed!", users: newCol });
    } finally { if (connection) await connection.release() }
})

//REMOVE
exports.removeBoardMember = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id } = req.params;
        const { user_id } = req.body;

        await connection.beginTransaction();

        const [result] = await connection.query('DELETE FROM board_user WHERE board_id = ? AND user_id = ?',
            [board_id, user_id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User is Not a Member of this board" });
        }

        const [newCol] = await connection.query('SELECT * FROM board_user WHERE board_id = ? AND user_id = ?',
            [board_id, user_id]
        )

        await connection.commit();

        emit.toBoard(board_id, 'board-member-removed', { board_id, user_id });
        res.json({ message: "User was Revoked Access from Board!", users: newCol });
    } finally { if (connection) await connection.release() }
});

//-----CARD MEMBER/ASSIGN-----\\

exports.addCardMember = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, card_id } = req.params;
        const { user_id } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query(`SELECT 1 FROM board_user WHERE user_id = ? AND board_id = ? LIMIT 1`,
            [user_id, board_id]
        );

        if (row.length === 0) {
            await connection.rollback();
            return res.status(403).json({ message: "User is Not a Board Member" });
        }

        const [assignedCard] = await connection.query(`SELECT 1 FROM card_member WHERE card_id = ? AND user_id = ? LIMIT 1`,
            [card_id, user_id]
        );

        if (assignedCard.length > 0) {
            await connection.rollback();
            return res.status(403).json({ message: "User is Already a Member of this Card!" });
        }

        await connection.query('INSERT INTO card_member (card_id, user_id) VALUES (?, ?)',
            [card_id, user_id]
        );

        const actor = await messageHandler.getUser(req.session.user.user_id);
        const target = await messageHandler.getUser(user_id);

        const [card] = await connection.query('SELECT card_name FROM card WHERE card_id = ?',
            [card_id]
        );

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, board_id, card_id, 'JOINED_CARD', JSON.stringify({ user: target.user_name })]
        )

        req.mail = {
            user_id, title: "Added to a card", message: `${actor.user_name} added you to card "${card[0].card_name}".`
        };

        await connection.commit();

        emit.toBoard(board_id, 'card-member-added', { card_id, user_id });
        res.json({ message: "User was Added to Card Members" });
    } finally {
        if (connection) await connection.release();
    }
});

exports.removeCardMember = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, card_id } = req.params;
        const { user_id } = req.body;

        await connection.beginTransaction();

        const [result] = await connection.query('DELETE FROM card_member WHERE card_id = ? AND user_id = ?',
            [card_id, user_id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User is Not a Member of this Card" });
        }

        const actor = await messageHandler.getUser(req.session.user.user_id);
        const target = await messageHandler.getUser(user_id);

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, board_id, card_id, 'LEFT_CARD', JSON.stringify({ user: target.user_name })]
        )

        await connection.commit();

        emit.toBoard(board_id, 'card-member-removed', { card_id, user_id });
        return res.json({ message: "User was Removed from Card" })
    } finally { if (connection) await connection.release() }
});

//-----CHECKLIST ASSIGN-----\\

exports.assignMember = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const card_id = req.params.card_id || req.body.card_id;
        const user_id = req.body.user_id || req.params.user_id;
        const item_id = req.body.item_id || req.params.item_id;

        await connection.beginTransaction();

        const [getItem] = await connection.query('SELECT * FROM checklist_items WHERE item_id = ?',
            [item_id]
        )

        if (getItem.length === 0) {
            await connection.rollback();
            return res.status(403).json({ message: "Unable to Find Item" });
        }

        const [row] = await connection.query(`SELECT t1.* FROM board_user AS t1 JOIN card_member AS t2 ON t1.user_id = t2.user_id WHERE t1.board_id = ? AND t2.card_id = ? AND t1.user_id = ? LIMIT 1`,
            [board_id, card_id, user_id]
        );

        if (row.length === 0) {
            await connection.rollback();
            return res.status(403).json({ message: "User is Not a Card Member" });
        }

        const [assignedRow] = await connection.query('SELECT * FROM assigned_checklist WHERE item_id = ? AND user_id = ? LIMIT 1',
            [item_id, user_id]
        );

        if (assignedRow.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: "User is already assigned to checklist" });
        }

        await connection.query('INSERT INTO assigned_checklist (item_id, user_id) VALUES (?, ?)',
            [item_id, user_id]
        );

        const actor = await messageHandler.getUser(req.session.user.user_id);
        const target = await messageHandler.getUser(user_id);

        const actorName = req.session.user.user_id === user_id ? "self" : actor.user_name;

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, board_id, card_id, 'ASSIGNED_ITEM', JSON.stringify({ user: target.user_name, item: getItem[0].item_text, actor: actorName })]
        )

        req.mail = {
            user_id, title: "Checklist assigned", message: `You were assigned "${getItem[0].item_text}".`,
        };

        await connection.commit();

        emit.toBoard(board_id, 'checklist-assigned', { card_id, item_id, user_id });
        res.json({ message: "User Successfully Assigned to Checklist!" });
    } finally {
        if (connection) await connection.release();
    }
});

exports.unassignMember = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.body.board_id || req.params.board_id;
        const card_id = req.body.card_id || req.params.card_id;
        const user_id = req.body.user_id || req.params.user_id;
        const item_id = req.body.item_id || req.params.item_id;

        await connection.beginTransaction();

        if (!user_id) {
            await connection.rollback();
            return res.status(400).json({ message: "Must provide user_id" });
        }

        const [getItem] = await connection.query('SELECT * FROM checklist_items WHERE item_id = ?',
            [item_id]
        )

        if (getItem.length === 0) {
            await connection.rollback();
            return res.status(403).json({ message: "Unable to Find Item" });
        }

        const [result] = await connection.query('DELETE FROM assigned_checklist WHERE item_id = ? AND user_id = ?',
            [item_id, user_id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User was Not Assigned to this Checklist" });
        }

        const actor = await messageHandler.getUser(req.session.user.user_id);
        const target = await messageHandler.getUser(user_id);

        const actorName = req.session.user.user_id === user_id ? "self" : actor.user_name;

        await connection.query('INSERT INTO activity_logs (user_id, board_id, card_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
            [actor.user_id, board_id, card_id, 'UNASSIGNED_ITEM', JSON.stringify({ user: target.user_name, item: getItem[0].item_text, actor: actorName })]
        )

        await connection.commit();

        emit.toBoard(board_id, 'checklist-unassigned', { card_id, item_id, user_id });
        res.json({ message: "User was Unassigned from checklist!" });
    } finally {
        if (connection) await connection.release();
    }
});

exports.publishComment = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const user_id = req.session.user.user_id;
        const { card_id, description } = req.body;

        await connection.beginTransaction();

const [row] = await connection.query(
    'SELECT c.*, l.board_id FROM card c JOIN list l ON c.list_id = l.list_id WHERE c.card_id = ?',
    [card_id]
)

        if (row.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: "Unable to Find Card" });
        }

await connection.query('INSERT INTO comments (card_id, user_id, comment) VALUES (?, ?, ?)',
    [card_id, user_id, description]
)

        await connection.commit();

        const board_id = row[0].board_id;

emit.toBoard(board_id, 'comment-added', { card_id, comment: description });
        res.json({ message: "Comment Successful!" });
    } finally { if (connection) await connection.release() }
})

exports.editComment = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const user_id = req.session.user.user_id;
        const { comment_id, description, board_id } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * FROM comments WHERE comment_id = ? AND user_id = ?',
            [comment_id, user_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: "Unable to Find Comment Index" });
        }

        await connection.query('UPDATE comments SET description = ? WHERE comment_id = ? AND user_id = ?',
            [description, comment_id, user_id]
        )

        await connection.commit();

        res.json({ message: "Comment Changed!" });

        emit.toBoard(board_id, 'comment-updated', { comment_id, description });
    } finally { if (connection) await connection.release() }
})

exports.deleteComment = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const user_id = req.session.user.user_id;
        const { comment_id, description, board_id } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * FROM comments WHERE comment_id = ? AND user_id = ?',
            [comment_id, user_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: "Unable to Find Comment Index" });
        }

        await connection.query('DELETE FROM comments WHERE comment_id = ? AND user_id = ?',
            [comment_id, user_id]
        )

        await connection.commit();

        emit.toBoard(board_id, 'comment-deleted', { comment_id });
        res.json({ message: "Comment Deleted!" });
    } finally { if (connection) await connection.release() }
})

exports.getComment = catchAsync(async (req, res) => {
    const { card_id } = req.params;

    const [comments] = await db.query('SELECT * FROM comments WHERE card_id = ? ORDER BY created_at ASC',
        [card_id]
    )

    res.json({ message: "Retrieved Comments from Card Successfully", comments: comments });
})