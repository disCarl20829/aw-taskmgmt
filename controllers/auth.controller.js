require('dotenv').config();

const db = require('../db');
const bcrypt = require('bcrypt');

const defaultLists = ['To Do', 'In Progress', 'Done'];

exports.register = async (req, res) => {
    if (req.session.user) return res.status(400).json({ message: "Invalid Action: You are Logged in." })

    let connection;

    try {
        connection = await db.getConnection();

        const { user_name, user_email, user_password, user_department } = req.body;

        await connection.beginTransaction();

        const [hasAlready] = await connection.query('SELECT user_name, user_email FROM user WHERE user_name = ? OR user_email = ?',
            [user_name, user_email]
        )

        if (hasAlready.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: "Existing Username or Email!" });
        };

        const hashPassword = await bcrypt.hash(user_password, 10);

        const [result] = await connection.query('INSERT INTO user (user_name, user_email, user_password) VALUES (?, ?, ?)',
            [user_name, user_email, hashPassword]
        );

        const user_id = result.insertId;

        const [boardResult] = await connection.query(
            'INSERT INTO board (board_owner, board_title, board_description) VALUES (?, ?, ?)',
            [user_id, 'My First Board', 'Welcome to your task manager!']
        );

        const board_id = boardResult.insertId;

        await connection.query('INSERT INTO board_visibility (board_id, user_id ) VALUES (?, ?)',
            [board_id, user_id]
        )

        for (let i = 0; i < defaultLists.length; i++) {
            await connection.query(
                'INSERT INTO list (board_id, list_name, list_position) VALUES (?, ?, ?)',
                [board_id, defaultLists[i], i + 1]
            );
        }

        await connection.commit();
        res.json({ message: "User Registered Successfully!" })
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Registration Failed: ", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
};

exports.signin = async (req, res) => {
    try {
        const { user_input, user_password } = req.body;

        const [user] = await db.query(
            'SELECT * FROM user WHERE user_name = ? OR user_email = ?',
            [user_input, user_input]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: "Invalid credentials!" });
        }

        const verify = await bcrypt.compare(user_password, user[0].user_password);

        if (!verify) {
            return res.status(404).json({ message: "Invalid password!" });
        }

        req.session.user = {
            user_id: user[0].user_id,
            user_name: user[0].user_name,
            user_email: user[0].user_email,
            user_img_path: user[0].user_img_path    
        };

        res.json({ message: "Sign-in Successful!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Sign-in Failed", error: err.message });
    }
};

exports.signout = (req, res) => {
    req.session.destroy();
    res.json({ message: "Signed out successfully!" });
};

exports.googleCallback = async (req, res) => {
    const user = req.user;

    req.session.user = {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_img_path: user.user_img_path
    };

    const frontendUrl = process.env.FRONTEND_URL

    if (!user.user_password) {
        return res.redirect(`${frontendUrl}/set-password`);
    }

    return res.redirect(`${frontendUrl}/dashboard`);
}