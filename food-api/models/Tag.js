const pool = require('../config/database');

class Tag {
  static async createTag(data) {
    const query = 'INSERT INTO tags (title, date_created) VALUES (?, NOW())';
    const [result] = await pool.query(query, [data.title]);
    return result.insertId;
  }

  static async getAllTags() {
    const query = 'SELECT * FROM tags ORDER BY date_created DESC';
    const [rows] = await pool.query(query);
    return rows;
  }

  static async updateTag(id, data) {
    const query = 'UPDATE tags SET title = ? WHERE id = ?';
    const [result] = await pool.query(query, [data.title, id]);
    return result.affectedRows > 0;
  }

  static async deleteTag(id) {
    const query = 'DELETE FROM tags WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Tag;
