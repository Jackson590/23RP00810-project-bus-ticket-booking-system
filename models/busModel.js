const db = require('../config/db');

class Bus {
    static getAllBuses() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM buses';
            db.query(query, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static getBusById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM buses WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result[0]);
            });
        });
    }

    static createBus(bus_name, route, seats, departure_time) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO buses (bus_name, route, seats, departure_time) VALUES (?, ?, ?, ?)';
            db.query(query, [bus_name, route, seats, departure_time], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static updateBus(id, bus_name, route, seats, departure_time) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE buses SET bus_name = ?, route = ?, seats = ?, departure_time = ? WHERE id = ?';
            db.query(query, [bus_name, route, seats, departure_time, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static deleteBus(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM buses WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Bus;
