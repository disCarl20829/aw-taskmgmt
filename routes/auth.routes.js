const express = require('express');
const passport = require('passport');

const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);

//GOOGLE AUTHENTICATION ROUTE
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/google/callback', 
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/index.html'
    }), authController.googleCallback 
)

module.exports = router;