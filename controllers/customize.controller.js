const db = require('../db');

exports.placeColorList = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, list_id } = req.params;
        const list_color = req.body.list_color;

        await connection.beginTransaction();

        await connection.query('UPDATE list SET list_color = ? WHERE board_id = ? AND list_id = ?',
            [list_color, board_id, list_id]
        )

        await connection.commit();
        res.json({ message: "Successfully Placed Color for this List" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Placing Color for List Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

exports.removeColorList = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, list_id } = req.params;

        await connection.beginTransaction();

        await connection.query('UPDATE list SET list_color = NULL WHERE board_id = ? AND list_id = ?',
            [board_id, list_id]
        )

        await connection.commit();
        res.json({ message: "Successfully Placed Color for this List" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Removing Color for List Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

//-----LABEL HANDLING-----\\

exports.editLabel = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const label_name = req.body.label_name;

        await connection.beginTransaction();

        await connection.query('UPDATE labels SET label_name = ? WHERE board_id = ?',
            [label_name, board_id]
        )

        await connection.commit();
        res.json({ message: "Successfully Modified Label" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Unable to Modify this Label: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

exports.removeLabel = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection()

        const board_id = req.params.board_id || req.body.board_id;
        const label_id = req.body.label_id;

        await connection.beginTransaction();

        await connection.query('DELETE FROM labels WHERE board_id = ? AND label_id = ?',
            [board_id, label_id]
        )

        await connection.commit();
        res.json({ message: "Unlisted Label from Card" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Unable to Erase Label from Board" });
    } finally {
        if (connection) await connection.release();
    }
}

exports.listLabel = async (req, res) => {
    let connection

    try {
        connection = await db.getConnection();

        const { board_id, card_id } = req.params;
        const label_color = req.body.label_color;

        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO labels (board_id, label_color) VALUES (?, ?)',
            [board_id, label_color]
        );

        const label_id = result.insertId;

        await connection.query('INSERT INTO card_labels (card_id, label_id) VALUES (?, ?)',
            [card_id, label_id]
        )

        await connection.commit();

        res.json({ message: "Initiated Label for this Board!" })
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Labeling Card failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
}

exports.unlistLabel = async (req, res) => {
    let connection ;

    try {
        connection = await db.getConnection();

        const card_id = req.params.card_id || req.body.card_id;
        const label_id = req.body.label_id;

        await connection.beginTransaction();

        await connection.query('DELETE FROM card_labels WHERE card_id = ? AND label_id = ?',
            [card_id, label_id]
        )

        await connection.commit();
        res.json({ message: "Unlisted Label from Card" });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Unable to Unlist Label from Card: ", error: err.message  });
    } finally {
        if (connection) await connection.release();
    }
}

exports.retrieveLabel = async (req, res) => {
    try {
        const board_id = req.params.board_id;
        const list_id = req.body.list_id

        const [result] = await db.query('SELECT t1.* FROM labels AS t1 JOIN card_labels t2 ON t1.label_id = t2.label_id WHERE t1.board_id = ? AND t1.label_id = ?',
            [board_id, list_id]
        )

        res.json({ message: "Successfully Placed Color for this List" , color_list: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Placing Color for List Failed: ", error: err.message });
    }
}