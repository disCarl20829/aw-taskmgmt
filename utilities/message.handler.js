const db = require('../db')

const logs = require('./activity.log..json');
const level = require('./activity.level.json');

exports.getUser = async (user_id, conn = null) => {
    const rows = await db.query('SELECT user_id, user_name FROM user WHERE user_id = ?',
        [user_id]
    )

    return rows.length ? rows[0] : null;
}

exports.buildActivity = (row) => {
    const config = logs(row.actionType) || log.OTHERS;

    let message = config.template;
    let data = {};

    try {
        data = JSON.parse(row.action_data);
    } catch {
        data = {};
    }

    for (const key in data) {
        message = message.replace(`{${key}}`, data[key]);
    }

    return {
        log_id: row.log_id,
        message,
        level: levels[config.level] || levels.info,
        created_at: row.created_at,
        board_id: row.board_id,
        card_id: row.card_id
    };
}