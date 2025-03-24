const db = require('../config/db');

class Ticket {
    static getAllTickets() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT tickets.id, users.name AS user_name, buses.bus_name, tickets.seat_number, tickets.booking_date FROM tickets JOIN users ON tickets.user_id = users.id JOIN buses ON tickets.bus_id = buses.id';
            db.query(query, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Ticket;
