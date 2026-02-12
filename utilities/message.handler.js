const db = require('../db')

const logs = require('./activity.log.json');
const level = require('./activity.level.json');

exports.getUser = async (user_id, conn = null) => {
    const [rows] = await db.query('SELECT user_id, user_name FROM user WHERE user_id = ?',
        [user_id]
    )

    return rows.length ? rows[0] : null;
}

exports.buildActivity = (row) => {
    const config = logs(row.actionType) || logs.OTHERS;

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

    return { message };
}