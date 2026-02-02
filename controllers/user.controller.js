const db = require('../db')
const bcrypt = require('bcrypt');

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

        res.json({ message: "Successfully Terminated User!" });

        req.session.destroy();
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
    } finally {
        if (connection) await connection.release();
    }
}

exports.searchUser = async (req, res) => {
    try {
        const bar = req.body.bar ?? "";
        const search = `%${bar}%`;

        const [result] = await db.query("SELECT user_id, user_name, user_email, user_img_path FROM user WHERE user_name LIKE ? OR user_email LIKE ?",
            [search, search]
        )

        res.json({ message: "Successfully Retrieved User(s)!", users: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not Retrieve User", error: err.message })
    }
}

exports.searchAll = async (req, res) => {
    try {
        const [result] = await db.query("SELECT user_id, user_name, user_email, user_img_path FROM user");

        res.json({ message: "Successfully Retrieved Users!", users: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not Load All Users", error: err.message })
    }
}

exports.searchByBoard = async (req, res) => {
    try {
        const board_id = req.params.board_id || req.body.board_id;
        const bar = req.body.bar ?? "";

        const search = `%${bar}%`;

        const [result] = await db.query('SELECT DISTINCT t1.user_id, t1.user_name, t1.user_email, t1.user_img_path, CASE WHEN t2.user_id IS NOT NULL THEN true ELSE false END AS isBoard FROM user AS t1 LEFT JOIN board_visibility AS t2 ON t1.user_id = t2.user_id AND t2.board_id = ? WHERE t1.user_name LIKE ? OR t1.user_email LIKE ?',
            [board_id, search, search]
        );

        res.json({ message: "Successfully Retrieved Users!", users: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not Retrieve Board Members", error: err.message })
    }
}

exports.searchByCard = async (req, res) => {
    try {
        const card_id = req.params.card_id;
        const bar = req.body.bar ?? '';

        const search = `%${bar}%`;

        const [result] = await db.query('SELECT DISTINCT t1.user_id, t1.user_name, t1.user_email, t1.user_img_path, CASE WHEN t2.user_id IS NOT NULL THEN true ELSE false END AS isCard FROM user AS t1 LEFT JOIN card_member AS t2 ON t1.user_id = t2.user_id AND t2.card_id = ? WHERE t1.user_name LIKE ? OR t1.user_email LIKE ?',
            [card_id, search, search]
        );

        res.json({ message: "Successfully Retrieved Card Members", users: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not Retrieve Card Members" });
    }
}

exports.searchByChecklist = async (req, res) => {
    try {
        const checklist_id = req.params.checklist_id;
        const bar = req.body.bar ?? '';

        const search = `%${bar}%`;

        const [result] = await db.query('SELECT DISTINCT t1.user_id, t1.user_name, t1.user_email, t1.user_img_path, CASE WHEN t2.user_id IS NOT NULL THEN true ELSE false END AS isAssigned FROM user AS t1 LEFT JOIN assigned_checklist AS t2 ON t1.user_id = t2.user_id AND t2.checklist_id = ? WHERE t1.user_name LIKE ? OR t1.user_email LIKE ?',
            [checklist_id, search, search]
        );

        res.json({ message: "Successfully Retrieved Assigned Checklist", users: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not Assigned Checklist" });
    }
}

//-----BOARD MEMBER-----\\

//ADD
exports.addBoardMember = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id;
        const user_id = req.body.user_id;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT 1 FROM board_visibility WHERE board_id = ? AND user_id = ? LIMIT 1',
            [board_id, user_id]
        );

        if (row.length !== 0) {
            await connection.rollback();
            return res.status(403).json({ message: "User already has access to this board!" });
        }

        await connection.query('INSERT INTO board_visibility (board_id, user_id) VALUES (?, ?)',
            [board_id, user_id]
        );

        await connection.commit();
        res.json({ message: "User successfully added to board!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Could not add member!", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//REMOVE
exports.removeBoardMember = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id;
        const user_id = req.body.user_id;

        await connection.beginTransaction();

        const [result] = await connection.query('DELETE FROM board_visibility WHERE board_id = ? AND user_id = ?',
            [board_id, user_id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User is not a member of this board" });
        }

        await connection.commit();
        res.json({ message: "User was removed from board!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Member could not be removed!", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//-----CARD MEMBER/ASSIGN-----\\

exports.addCardMember = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, card_id } = req.params;
        const user_id = req.body.user_id;

        await connection.beginTransaction();

        const [row] = await connection.query(`SELECT 1 FROM board_visibility WHERE user_id = ? AND board_id = ? LIMIT 1`,
            [user_id, board_id]
        );

        if (row.length === 0) {
            await connection.rollback();
            return res.status(403).json({ message: "User is not a board member" });
        }

        const [assignedCard] = await connection.query(`SELECT 1 FROM card_member WHERE card_id = ? AND user_id = ? LIMIT 1`,
            [card_id, user_id]
        );

        if (assignedCard.length > 0) {
            await connection.rollback();
            return res.status(403).json({ message: "User is already a member of this card!" });
        }

        await connection.query(
            'INSERT INTO card_member (card_id, user_id) VALUES (?, ?)',
            [card_id, user_id]
        );

        await connection.commit();
        res.json({ message: "User was added to card members" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Member could not be added to card", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

exports.removeCardMember = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const card_id = req.params.card_id;
        const user_id = req.body.user_id;

        await connection.beginTransaction();

        const [result] = await connection.query('DELETE FROM card_member WHERE card_id = ? AND user_id = ?',
            [card_id, user_id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User is not a member of this card" });
        }

        await connection.commit();
        return res.json({ message: "User was Removed from Card" })
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Member could not be removed to card", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//-----CHECKLIST ASSIGN-----\\

exports.assignMember = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, card_id } = req.params;
        const { checklist_id, user_id } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query(`SELECT 1 FROM board_visibility AS t1 JOIN card_member AS t2 ON t1.user_id = t2.user_id WHERE t1.board_id = ? AND t2.card_id = ? AND (t1.user_id = ? OR t2.user_id = ?)  LIMIT 1`,
            [board_id, card_id, user_id, user_id]
        );

        if (row.length === 0) {
            await connection.rollback();
            return res.status(403).json({ message: "User is not a card member" });
        }

        const [assignedRow] = await connection.query('SELECT 1 FROM assigned_checklist WHERE checklist_id = ? AND user_id = ? LIMIT 1',
            [checklist_id, user_id]
        );

        if (assignedRow.length > 0) {
            await connection.rollback();
            return res.status(403).json({ message: "User is already assigned to checklist" });
        }

        await connection.query('INSERT INTO assigned_checklist (checklist_id, user_id) VALUES (?, ?)',
            [checklist_id, user_id]
        );

        await connection.commit();
        res.json({ message: "User successfully assigned to checklist!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Could not assign member to checklist", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

exports.unassignMember = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const checklist_id = req.body.checklist_id || req.params.checklist_id;
        const user_id = req.body.user_id;

        await connection.beginTransaction();

        if (!user_id) {
            await connection.rollback();
            return res.status(400).json({ message: "Must provide user_id" });
        }

        const [result] = await connection.query('DELETE FROM assigned_checklist WHERE checklist_id = ? AND user_id = ?',
            [checklist_id, user_id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "User is not assigned to this checklist" });
        }

        await connection.commit();

        res.json({ message: "User was unassigned from checklist!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Member could not be unassigned from checklist", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}