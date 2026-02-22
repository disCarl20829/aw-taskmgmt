const db = require('../db');

module.exports = async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: Please log in." });
        }

        const userId = req.session.user.user_id;
        let query, params;

        if (req.params.board_id || req.body?.board_id) {
            query = 'SELECT 1 FROM board_user WHERE board_id = ? AND user_id = ? LIMIT 1';
            params = [req.params.board_id || req.body?.board_id, userId];
        }
        else if (req.params.list_id || req.body?.list_id) {
            query = 'SELECT 1 FROM list AS l JOIN board_user AS bv ON l.board_id = bv.board_id WHERE l.list_id = ? AND bv.user_id = ? LIMIT 1';
            params = [req.params.list_id || req.body?.list_id, userId];
        }
        else if (req.params.card_id || req.body?.card_id) {
            query = 'SELECT 1 FROM card AS c JOIN list AS l ON c.list_id = l.list_id JOIN board_user AS bv ON l.board_id = bv.board_id WHERE c.card_id = ? AND bv.user_id = ? LIMIT 1';
            params = [req.params.card_id || req.body?.card_id, userId];
        }
        else if (req.params.checklist_id || req.body?.checklist_id) {
            query = 'SELECT 1 FROM checklist AS ch JOIN card AS c ON ch.card_id = c.card_id JOIN list AS l ON c.list_id = l.list_id JOIN board_user AS bv ON l.board_id = bv.board_id WHERE ch.checklist_id = ? AND bv.user_id = ? LIMIT 1';
            params = [req.params.checklist_id || req.body?.checklist_id, userId];
        }
        else if (req.params.item_id || req.params.checklistItem_id) {
            query = 'SELECT 1 FROM checklist_items AS ci JOIN checklist AS ch ON ci.checklist_id = ch.checklist_id JOIN card AS c ON ch.card_id = c.card_id JOIN list AS l ON c.list_id = l.list_id JOIN board_user AS bv ON l.board_id = bv.board_id WHERE ci.item_id = ? AND bv.user_id = ? LIMIT 1';
            params = [req.params.item_id || req.params.checklistItem_id, userId];
        }
        else {
            return res.status(400).json({ message: "Resource identifier not found!" });
        }

        const [result] = await db.query(query, params);

        if (result.length === 0) {
            return res.status(403).json({ message: "Unauthorized Action: User is not a Member!" });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Authorization Check Failed.", error: err.message });
    }
};