const express = require('express');
const router = express.Router();
const Bus = require('../models/busModel');
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login');
    }
    next();
};

// Admin dashboard
router.get('/admin/dashboard', isAdmin, (req, res) => {
    res.render('adminDashboard', { user: req.session.user });
});

// View all buses
router.get('/admin/buses', isAdmin, async (req, res) => {
    try {
        const buses = await Bus.getAllBuses();
        res.render('manageBuses', { buses });
    } catch (error) {
        res.status(500).send('Error fetching buses: ' + error.message);
    }
});

// Add a new bus (GET)
router.get('/admin/buses/add', isAdmin, (req, res) => {
    res.render('addBus');
});

// Add a new bus (POST)
router.post('/admin/buses/add', isAdmin, async (req, res) => {
    const { bus_name, route, seats, departure_time } = req.body;
    try {
        await Bus.createBus(bus_name, route, seats, departure_time);
        res.redirect('/admin/buses');
    } catch (error) {
        res.status(500).send('Error adding bus: ' + error.message);
    }
});

// Edit a bus (GET)
router.get('/admin/buses/edit/:id', isAdmin, async (req, res) => {
    const busId = req.params.id;
    try {
        const bus = await Bus.getBusById(busId);
        res.render('editBus', { bus });
    } catch (error) {
        res.status(500).send('Error fetching bus for edit: ' + error.message);
    }
});

// Edit a bus (POST)
router.post('/admin/buses/edit/:id', isAdmin, async (req, res) => {
    const busId = req.params.id;
    const { bus_name, route, seats, departure_time } = req.body;
    try {
        await Bus.updateBus(busId, bus_name, route, seats, departure_time);
        res.redirect('/admin/buses');
    } catch (error) {
        res.status(500).send('Error updating bus: ' + error.message);
    }
});

// Delete a bus
router.get('/admin/buses/delete/:id', isAdmin, async (req, res) => {
    const busId = req.params.id;
    try {
        await Bus.deleteBus(busId);
        res.redirect('/admin/buses');
    } catch (error) {
        res.status(500).send('Error deleting bus: ' + error.message);
    }
});

// View all bookings (Admin)
router.get('/admin/bookings', isAdmin, async (req, res) => {
    try {
        const bookings = await Ticket.getAllTickets(); // Fetch all tickets (bookings)
        res.render('manageBookings', { bookings });
    } catch (error) {
        res.status(500).send('Error fetching bookings: ' + error.message);
    }
});

// View all tickets (Admin)
router.get('/admin/tickets', isAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.getAllTickets();
        res.render('manageTickets', { tickets });
    } catch (error) {
        res.status(500).send('Error fetching tickets: ' + error.message);
    }
});

// Example route in admin.js or auth.js
router.get('/admin/dashboard', isAdmin, async (req, res) => {
    try {
        const recentBookings = await Ticket.getRecentBookings(10); // Fetch last 10 bookings
        res.render('adminDashboard', { 
            user: req.session.user, 
            recentBookings // Pass recentBookings to the view
        });
    } catch (error) {
        res.status(500).send('Error fetching recent bookings: ' + error.message);
    }
});

// View all users (Admin)
router.get('/admin/users', isAdmin, async (req, res) => {
    try {
        const users = await User.getAllUsers(); // Fetch all users
        res.render('manageUsers', { users });
    } catch (error) {
        console.error('Error fetching users:', error); // Log the error
        res.status(500).send('Error fetching users: ' + error.message);
    }
});

// Edit a user (GET)
router.get('/admin/users/edit/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.getUserById(userId); // Fetch user by ID
        res.render('editUser', { user });
    } catch (error) {
        res.status(500).send('Error fetching user for edit: ' + error.message);
    }
});

// Edit a user (POST)
router.post('/admin/users/edit/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    const { name, email, role } = req.body;
    try {
        await User.updateUser(userId, name, email, role);
        res.redirect('/admin/users');
    } catch (error) {
        res.status(500).send('Error updating user: ' + error.message);
    }
});

// Delete a user
router.get('/admin/users/delete/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    try {
        await User.deleteUser(userId);
        res.redirect('/admin/users');
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
});

module.exports = router;