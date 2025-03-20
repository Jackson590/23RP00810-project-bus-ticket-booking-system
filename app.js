const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const db = require('./config/db'); // Ensure MySQL connection is included

const app = express();

// Session configuration
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Default route: Redirect to login page
app.get('/', (req, res) => {
    res.redirect('/login');  // Redirect user to login page
});

app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('profile', {
        user: req.session.user,
        userDashboardUrl: '/user-dashboard'
    });
});


app.get('/user-dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');  // Redirect to login if not authenticated
    }
    
    res.render('userDashboard', { user: req.session.user });
});

// Middleware to check authentication
app.use((req, res, next) => {
    if (!req.session.user && req.path !== "/login") {
        return res.redirect("/login");
    }
    next();
});

// Routes
app.use(authRoutes);
app.use(adminRoutes);
app.use(userRoutes); // Include user dashboard routes

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
