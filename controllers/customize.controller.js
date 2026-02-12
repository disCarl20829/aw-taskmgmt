const db = require('../db');

const catchAsync = require('../middleware/catch.middleware')
const emit = require('../utilities/socket');

exports.placeColorList = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, list_id } = req.params;
        const { list_color } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * FROM list WHERE list_id = ?',
            [list_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "List not found!" });
        }

        await connection.query('UPDATE list SET list_color = ? WHERE board_id = ? AND list_id = ?',
            [list_color, board_id, list_id]
        )

        await connection.commit();

        emit.toBoard(board_id, 'list-color-updated', { list_id, list_color });
        res.json({ message: "Successfully Placed Color for this List!" });
    } finally { if (connection) await connection.release() }
});

exports.removeColorList = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, list_id } = req.params;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * from list WHERE list_id = ?',
            [list_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "List not found!" });
        }

        await connection.query('UPDATE list SET list_color = NULL WHERE board_id = ? AND list_id = ?',
            [board_id, list_id]
        )

        await connection.commit();

        emit.toBoard(board_id, 'list-color-removed', { list_id });
        res.json({ message: "Successfully Removed Color for this List!" });
    } finally { if (connection) await connection.release() }
});

//-----LABEL HANDLING-----\\

exports.listLabel = catchAsync(async (req, res) => {
    let connection

    try {
        connection = await db.getConnection();

        const { board_id, card_id } = req.params;
        const { label_color } = req.body;
        let label_id;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT label_id FROM labels WHERE board_id = ? AND label_color = ?',
            [board_id, label_color]
        )

        if (row.length === 0) {
            const [result] = await connection.query('INSERT INTO labels (board_id, label_color) VALUES (?, ?)',
                [board_id, label_color]
            );

            label_id = result.insertId;
        } else {
            label_id = row[0].label_id;
        }

        await connection.query('INSERT INTO card_labels (card_id, label_id) VALUES (?, ?)',
            [card_id, label_id]
        )

        await connection.commit();

        emit.toBoard(board_id, 'card-label-added', { card_id, label_id, label_color });
        res.json({ message: "Initiated Label for this Board!" })
    } finally { if (connection) await connection.release() }
});

exports.unlistLabel = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const board_id = req.params.board_id || req.body.board_id;
        const card_id = req.params.card_id || req.body.card_id;
        const { label_id } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * FROM labels WHERE label_id = ? AND board_id = ?',
            [label_id, board_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Label Not Found!" });
        }

        await connection.query('DELETE FROM card_labels WHERE card_id = ? AND label_id = ?',
            [card_id, label_id]
        )

        await connection.commit();

        emit.toBoard(board_id, 'card-label-removed', { card_id, label_id });
        res.json({ message: "Unlisted Label from Card!" });
    } finally { if (connection) await connection.release() }
});

exports.editLabel = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

        const { board_id, label_id } = req.params
        const { label_name } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * FROM labels WHERE label_id = ? AND board_id = ?',
            [label_id, board_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Label Not Found!" });
        }

        await connection.query('UPDATE labels SET label_name = ? WHERE label_id = ? AND board_id = ?',
            [label_name, label_id, board_id]
        )

        await connection.commit();

        emit.toBoard(board_id, 'label-updated', { label_id, label_name });
        res.json({ message: "Successfully Modified Label!" });
    } finally { if (connection) await connection.release() }
});

exports.removeLabel = catchAsync(async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection()

        const board_id = req.params.board_id || req.body.board_id;
        const { label_id } = req.body;

        await connection.beginTransaction();

        const [row] = await connection.query('SELECT * FROM labels WHERE label_id = ? AND board_id = ?',
            [label_id, board_id]
        )

        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Label Not Found!" });
        }

        await connection.query('DELETE FROM labels WHERE board_id = ? AND label_id = ?',
            [board_id, label_id]
        )

        await connection.commit();

        emit.toBoard(board_id, 'label-deleted', { label_id });
        res.json({ message: "Unlisted Label from Card." });
    } finally { if (connection) await connection.release() }
});


exports.retrieveLabel = catchAsync(async (req, res) => {
    const { board_id, card_id } = req.params;

    const [result] = await db.query('SELECT t1.*, CASE WHEN t2.card_id IS NOT NULL THEN true ELSE false END AS assigned FROM labels AS t1 LEFT JOIN card_labels AS t2 ON t1.label_id = t2.label_id AND t2.card_id = ? WHERE t1.board_id = ?',
        [card_id, board_id]
    );

    res.json({ message: "Successfully Placed Color for this List!", color_list: result });
});