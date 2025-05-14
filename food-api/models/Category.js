const pool = require('../config/database');

class Category {
  static async addCategory(data) {
    const query = `
      INSERT INTO categories (name, parent_id, branch_id, slug, image, row_order, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.name,
      data.parent_id || null,
      data.branch_id,
      data.slug,
      data.image,
      data.row_order || 0,
      data.status || 1,
    ];
    const [result] = await pool.query(query, values);
    return result.insertId;
  }

  static async getAllCategories() {
    const query = `
      SELECT categories.*, branch.branch_name AS branch_name
      FROM categories
      LEFT JOIN branch ON categories.branch_id = branch.id
      ORDER BY categories.row_order ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async deleteCategory(id) {
    const query = 'DELETE FROM categories WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async updateCategory(id, data) {
    const query = `
      UPDATE categories
      SET name = ?, description = ?, branch_id = ?, image = ?, status = ?, parent_id = ?
      WHERE id = ?
    `;
    const values = [
      data.name,
      data.description,
      data.branch_id,
      data.image || null,
      data.status,
      data.parent_id || null,
      id,
    ];
    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  }
}

module.exports = Category;
