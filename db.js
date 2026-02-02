const mysql = require('mysql2');

const connect_pool = mysql.createPool({
    host: '192.168.1.21',
    user: 'remote_user',
    password: 'password123',
    database: 'task_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = connect_pool.promise();