const pool = require('../config/database');

class Tax {
  static async createTax(data) {
    const query = 'INSERT INTO taxes (title, percentage, status) VALUES (?, ?, ?)';
    const status = data.status === 'active' ? 1 : 0; // Convert status to 0 or 1
    const [result] = await pool.query(query, [data.title, data.percentage, status]);
    return result.insertId;
  }

  static async getAllTaxes() {
    const query = 'SELECT * FROM taxes';
    const [rows] = await pool.query(query);
    return rows;
  }

  static async updateTax(id, data) {
    const query = 'UPDATE taxes SET title = ?, percentage = ?, status = ? WHERE id = ?';
    const status = data.status === 'active' ? 1 : 0; // Convert status to 0 or 1
    const [result] = await pool.query(query, [data.title, data.percentage, status, id]);
    return result.affectedRows > 0;
  }

  static async deleteTax(id) {
    const query = 'DELETE FROM taxes WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Tax;
