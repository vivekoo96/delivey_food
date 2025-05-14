// Define a MySQL-based implementation for Ticket Types
const pool = require('../config/database');

class TicketType {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM ticket_types ORDER BY createdAt DESC');
    return rows;
  }

  static async create(title) {
    const [result] = await pool.query('INSERT INTO ticket_types (title, createdAt) VALUES (?, NOW())', [title]);
    return { id: result.insertId, title };
  }
}

module.exports = TicketType;
