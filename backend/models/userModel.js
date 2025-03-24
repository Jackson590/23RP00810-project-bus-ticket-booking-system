const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    // Register a new user
    static async register(name, email, password, role = 'user') {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(query, [name, email, hashedPassword, role], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Login a user
    static async login(email, password) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ?';
            db.query(query, [email], async (err, results) => {
                if (err) reject(err);
                if (results.length === 0) resolve(null);

                const user = results[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) resolve(user);
                else resolve(null);
            });
        });
    }

    // Fetch all users
    static async getAllUsers() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users';
            db.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    // Fetch a user by ID
    static async getUserById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id = ?';
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                if (results.length === 0) resolve(null);
                resolve(results[0]);
            });
        });
    }

    // Update a user
    static async updateUser(id, name, email, role) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
            db.query(query, [name, email, role, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Delete a user
    static async deleteUser(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM users WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = User;