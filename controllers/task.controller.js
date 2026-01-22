const db = require('../db');
const fs = require('fs');

//-----BOARD HANDLING-----\\

//CREATE
exports.createBoard = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_title, board_description } = req.body;
        const user_id = req.session.user.user_id;

        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO board (board_title, board_description, board_owner) VALUES (?, ?, ?)',
            [board_title, board_description, user_id]
        );

        const board_id = result.insertId;

        await connection.query('INSERT INTO board_visibility (board_id, user_id) VALUES (?, ?)',
            [board_id, user_id]
        );

        await connection.commit();

        res.json({ message: "Board Successfully Created!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Board Creation Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
};

//PATCH/UPDATE
exports.patchBoard = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_title, board_description } = req.body;
        const board_id = req.params.board_id;

        await connection.beginTransaction();

        await connection.query('UPDATE board SET board_title = ?, board_description = ? WHERE board_id = ?',
            [board_title, board_description, board_id]
        );

        await connection.commit();

        res.json({ message: "Board Patched Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Board Patch Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//DELETE
exports.deleteBoard = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id;

        await connection.beginTransaction();

        const [result] = await connection.query('DELETE FROM board_visibility WHERE board_id = ?',
            [board_id]
        )

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Board not Found from board_visibility)" })
        }

        await connection.query('DELETE FROM board WHERE board_id = ?',
            [board_id]
        );

        await connection.commit();

        res.json({ message: "Board was Deleted Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Board Deletion Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//RETRIEVE
exports.getBoards = async (req, res) => {
    try {
        const user_id = req.session.user.user_id;

        const [result] = await db.query('SELECT t1.* FROM board AS t1 JOIN board_visibility AS t2 ON t1.board_id = t2.board_id WHERE t2.user_id = ?',
            [user_id]
        );

        res.json({ message: "Boards was Successfully Retrieved", boards: result })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Board Retrieval Failed: ", error: err.message });
    }
}

//-----LISTS HANDLING-----\\

//CREATE
exports.createList = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { list_name, list_position } = req.body;
        const board_id = req.body.board_id || req.params.board_id

        await connection.beginTransaction();

        await connection.query('INSERT INTO list (board_id, list_name, list_position) VALUES (?, ?, ?)',
            [board_id, list_name, list_position]
        );

        await connection.commit();

        res.json({ message: "List Created Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "List Creation Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//PATCH/UPDATE
exports.patchList = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { list_name, list_position } = req.body;
        const list_id = req.params.list_id

        await connection.beginTransaction();

        await connection.query('UPDATE list SET list_name = ?, list_position = ? WHERE list_id = ?',
            [list_name, list_position, list_id]
        );

        await connection.commit();

        res.json({ message: "List Patched Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "List Patch Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//DELETE
exports.deleteList = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const list_id = req.params.list_id || req.body.list_id;

        await connection.beginTransaction();

        await connection.query('DELETE FROM list WHERE list_id = ?',
            [list_id]
        )

        await connection.commit();

        res.json({ message: "List was Deleted Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();

        console.error(err);
        res.status(500).json({ message: "List Deletion Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//RETRIEVE
exports.getLists = async (req, res) => {
    try {
        const board_id = req.params.board_id

        const [result] = await db.query('SELECT * FROM list WHERE board_id = ? ORDER BY list_position ASC',
            [board_id]
        );

        for (const list of result) {
            const [cards] = await db.query('SELECT * FROM card WHERE list_id = ? ORDER BY card_position ASC',
                [list.list_id]
            )

            list.cards = cards;
        }

        res.json({ message: "Lists were Retrieved", lists: result })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lists Retrieval Failed: ", error: err.message });
    }
}

//-----CARD HANDLING-----\\

//CREATE
exports.createCard = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { list_id, card_name, card_description, card_position, due_date, due_time } = req.body;

        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO card (list_id, card_name, card_description, card_position, due_date, due_time) VALUES (?, ?, ?, ?, ?, ?)',
            [list_id, card_name, card_description, card_position, due_date, due_time]
        )

        const card_id = result.insertId;

        const [row] = await connection.query('SELECT * FROM card WHERE card_id = ?',
            [card_id] //Notification Feature Soon
        )

        await connection.commit();

        res.json({ message: "Card Created Successfully!" })
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Card Creation Failed! ", error: err.message })
    } finally {
        if (connection) await connection.release();
    }
}

//PATCH/UPDATE
exports.patchCard = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { card_name, card_description, card_position, due_date, due_time, completed } = req.body;
        const card_id = req.body.card_id || req.params.card_id;

        await connection.beginTransaction();

        await connection.query('UPDATE card SET card_name = ?, card_description = ?, card_position = ?, due_date = ?, due_time = ?, completed = ? WHERE card_id = ?',
            [card_name, card_description, card_position, due_date, due_time, completed, card_id]
        );

        await connection.commit();

        res.json({ message: "Card Patched Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Card Patch Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//DELETE
exports.deleteCard = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const card_id = req.params.card_id || req.body.card_id;

        await connection.beginTransaction();

        await connection.query('DELETE FROM card WHERE card_id = ?',
            [card_id]
        )

        await connection.commit();

        res.json({ message: "Card was Deleted Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Card Deletion Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//RETRIEVE (CARD INFO)
exports.getCard = async (req, res) => {
    try {
        const card_id = req.params.card_id || req.body.card_id;

        const [result] = await db.query('SELECT * FROM card WHERE card_id = ? ORDER BY list_position ASC',
            [card_id]
        );

        if (result.length === 0) {
            await connection.rollback()
            return res.status(404).json({ message: "Card not Found!" });
        }

        const card = result[0];

        const [att] = await db.query('SELECT * FROM attachment WHERE card_id = ?',
            [card_id]
        );

        const [label] = await db.query('SELECT * FROM card_labels WHERE card_id = ?',
            [card_id]
        )

        card.attachments = att;
        card.labels = label;

        res.json({ message: "Cards were Retrieved", cards: result })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lists Retrieval Failed: ", error: err.message });
    }
}

//-----CHECKLIST HANDLING-----\\

//CREATE
exports.createChecklist = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const checklist_title = req.body.checklist_title
        const card_id = req.body.card_id || req.params.card_id;

        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO checklist (card_id, checklist_title) VALUES (?, ?)',
            [card_id, checklist_title]
        )

        await connection.commit();

        res.json({ message: "Checklist Created Successfully!" })
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Checklist Creation Failed!", error: err.message })
    } finally {
        if (connection) await connection.release();
    }
}

//PATCH/UPDATE
exports.patchChecklist = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const checklist_id = req.body.checklist_id || req.params.checklist_id;
        const { checklist_title, checklist_position } = req.body;

        await connection.beginTransaction();

        await connection.query('UPDATE checklist SET checklist_title = ?, checklist_position = ? WHERE checklist_id = ?',
            [checklist_title, checklist_position, checklist_id]
        );

        await connection.commit();

        res.json({ message: "Checklist Patched Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Checklist Patch Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//DELETE
exports.deleteChecklist = async (req, res) => {
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

        await connection.commit();

        res.json({ message: "Checklist was Deleted Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Checklist Deletion Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//RETRIEVE
exports.getChecklist = async (req, res) => {
    try {
        const card_id = req.body.card_id || req.params.card_id

        const [result] = await db.query('SELECT * FROM checklist WHERE card_id = ? ORDER BY checklist_position ASC',
            [card_id]
        );

        for (const checklist of result) {
            const [items] = await db.query('SELECT * FROM checklist_items WHERE checklist_id = ? ORDER BY item_position ASC',
                [checklist.checklist_id]
            );

            checklist.items = items;
        }

        res.json({ message: "Checklist Items were Retrieved", checklists: result })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Checklist Items Retrieval Failed: ", error: err.message });
    }
}

//-----ITEM (CHECKLIST) HANDLING-----\\

//CREATE
exports.addItem = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { checklist_id, item_text, item_position, due_date, due_time } = req.body;

        await connection.beginTransaction();

        await connection.query('INSERT INTO checklist_items (checklist_id, item_text, item_position, due_date, due_time) VALUES (?, ?, ?, ?, ?)',
            [checklist_id, item_text, item_position, due_date, due_time]
        )

        await connection.commit();

        res.json({ message: "Checklist Item Created Successfully!" })
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Checklist Item Creation Failed! ", error: err.message })
    } finally {
        if (connection) await connection.release();
    }
}

//PATCH/UPDATE
exports.updateItem = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const item_id = req.params.item_id || req.body.item_id;
        const { item_text, item_position, due_date, due_time, is_completed } = req.body;

        await connection.beginTransaction();

        await connection.query('UPDATE checklist_items SET item_text = ?, item_position = ?, due_date = ?, due_time = ?, is_completed = ? WHERE item_id = ?',
            [item_text, item_position, due_date, due_time, is_completed, item_id]
        )

        await connection.commit();


        res.json({ message: "Checklist Item Patched Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();

        console.error(err);
        res.status(500).json({ message: "Checklist Item Update Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//DELETE
exports.removeItem = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const item_id = req.params.item_id || req.body.item_id;

        await connection.beginTransaction();

        await connection.query('DELETE FROM checklist_items WHERE item_id = ?',
            [item_id]
        )

        await connection.commit();

        res.json({ message: "Checklist Item was Deleted Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Checklist Item Deletion Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//-----ATTACHMENT HANDLING-----\\

exports.addAttachment = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, list_id, card_id } = req.params;
        const { external_url, attachment_type } = req.body;
        const user_id = req.user.user_id;

        let filePath = null;
        let attachment_name = null;
        let mimeType = null;
        let fileSize = null;
        let attachmentType = attachment_type || 'file';

        if (req.file) {
            attachment_name = req.file.originalname;
            filePath = `/public/uploads/attachment/attachment-${card_id}/${req.file.filename}`;
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

        const [result] = await connection.query(`INSERT INTO attachments (board_id, list_id, card_id, attachment_name, file_path, external_url, attachment_type, mime_type, file_size, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [board_id, list_id, card_id, attachment_name, filePath, external_url, attachmentType, mimeType, fileSize, user_id]
        );

        await connection.commit();

        res.json({ message: "Media Attached Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: "Error Attaching Media: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

exports.editAttachment = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const attachment_id = req.params.attachment_id || req.body.attachment_id;
        const { attachment_name, external_url } = req.body;

        await connection.beginTransaction();

        const [current] = await connection.query('SELECT * FROM attachments WHERE attachment_id = ?',
            [attachment_id]
        );

        if (current.length === 0) {
            await connection.rollback()
            return res.status(404).json({ message: "Attachment not Found!" });
        }

        if (req.file) {
            external_url = null;
        } else if (external_url) {
            attachment_name = attachment_name || external_url;
            external_url = external_url;
        } else {
            return res.status(400).json({ message: "None Media Provided!" });
        }

        await connection.query('UPDATE attachments SET attachment_name = ?, external_url = ?, attachment_type = ? WHERE attachment_id = ?',
            [attachment_name, external_url, attachment_id]
        );

        await connection.commit();

        res.json({ message: "Attachment Edited Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Error Editing Attachment: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

exports.removeAttachment = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const attachment_id = req.params.attachment_id || req.body.attachment_id;

        await connection.beginTransaction();

        const [result] = await connection.query('SELECT * FROM attachments WHERE attachment_id = ?',
            [attachment_id]
        );

        if (result.length === 0) {
            await connection.rollback()
            return res.status(404).json({ message: "Attachment not Found!" });
        }

        await connection.query('DELETE FROM attachments WHERE attachment_id = ?',
            [attachment_id]
        )

        await connection.commit();

        const filePath = result[0].file_path;
        if (filePath) {
            const fullPath = path.join(__dirname, '../', filePath);
            fs.promises.unlink(fullPath)
                .catch(err => console.error('Background file deletion failed:', err));
        }

        res.json({ message: "Attachment was Deleted Successfully!" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Error Deleting Attachment: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}