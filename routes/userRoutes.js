const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Assuming you have a MySQL connection file

// Book Tickets - Render Form
router.get("/book-tickets", (req, res) => {
    res.render("bookTickets", { user: req.session.user });
});

// Book Tickets - Handle Booking Submission
router.post("/book-tickets", (req, res) => {
    const { user_id, bus_id, date, seats } = req.body;
    const query = "INSERT INTO bookings (user_id, bus_id, date, seats) VALUES (?, ?, ?, ?)";
    db.query(query, [user_id, bus_id, date, seats], (err, result) => {
        if (err) throw err;
        res.redirect("/view-bookings");
    });
});

// View Bookings
router.get("/view-bookings", (req, res) => {
    const userId = req.session.user.id;
    const query = "SELECT * FROM bookings WHERE user_id = ?";
    db.query(query, [userId], (err, bookings) => {
        if (err) throw err;
        res.render("viewBookings", { user: req.session.user, bookings });
    });
});

// Profile
router.get("/profile", (req, res) => {
    const userId = req.session.user.id;
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [userId], (err, user) => {
        if (err) throw err;
        res.render("profile", { user: user[0] });
    });
});

module.exports = router;
