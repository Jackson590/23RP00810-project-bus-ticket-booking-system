const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Render the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Render the registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle user registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await User.register(name, email, password);
        res.redirect('/login');
    } catch (error) {
        res.send('Error: ' + error.message);
    }
});

// Handle user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    if (user) {
        req.session.user = user; // Store user in session
        res.redirect('/dashboard'); // Redirect to the appropriate dashboard
    } else {
        res.send('Invalid email or password');
    }
});

// Handle user logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Admin and User Dashboard
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if user is not authenticated
    }

    // Check if the user is an admin or regular user
    const isAdmin = req.session.user.role === 'admin';
    if (isAdmin) {
        res.render('adminDashboard', { user: req.session.user }); // Render Admin Dashboard
    } else {
        res.render('userDashboard', { user: req.session.user }); // Render User Dashboard
    }
});

module.exports = router;
