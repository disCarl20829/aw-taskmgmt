const mysql = require('mysql2');

const connect_pool = mysql.createPool({
    host: 'localhost',
    user: 'task_user',
    password: '',
    database: 'task_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = connect_pool.promise();