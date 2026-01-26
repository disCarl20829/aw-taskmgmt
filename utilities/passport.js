require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require('../db');

const defaultLists = ['To Do', 'In Progress', 'Done'];

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    const [row] = await db.query('SELECT * FROM user WHERE user_id = ?',
        [id]
    );
    done(null, row[0]);
});

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        const connection = await db.getConnection();

        try {
            const email = profile.emails[0].value;

            const [rows] = await connection.query(
                'SELECT * FROM user WHERE user_email = ?',
                [email]
            );

            let user;

            if (rows.length > 0) {
                user = rows[0];
            } else {
                const [result] = await connection.query(
                    'INSERT INTO user (user_name, user_email, user_img_path) VALUES (?, ?, ?)',
                    [
                        profile.displayName,
                        email,
                        profile.photos[0].value
                    ]
                );

                const user_id = result.insertId;

                user = {
                    user_id: user_id,
                    user_name: profile.displayName,
                    user_email: email,
                    user_img_path: profile.photos[0].value,
                    user_password: null
                };

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
            }

            await connection.commit();
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));