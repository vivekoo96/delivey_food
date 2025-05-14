const pool = require('../config/database');

class AttributeValue {
  static async createAttributeValue(data) {
    const query = 'INSERT INTO attribute_values (attribute_id, filterable, value, swatche_type, swatche_value, status) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(query, [data.attribute_id, data.filterable || 0, data.value, data.swatche_type || 0, data.swatche_value || null, data.status || 1]);
    return result.insertId;
  }

  static async getAllAttributeValues() {
    const query = 'SELECT * FROM attribute_values ORDER BY id ASC';
    const [rows] = await pool.query(query);
    return rows;
  }

  static async getAttributeValues(attributeId) {
    const query = 'SELECT * FROM attribute_values WHERE attribute_id = ? AND status = 1';
    const [rows] = await pool.query(query, [attributeId]);
    return rows;
  }

  static async updateAttributeValue(id, data) {
    const query = 'UPDATE attribute_values SET attribute_id = ?, filterable = ?, value = ?, swatche_type = ?, swatche_value = ?, status = ? WHERE id = ?';
    const [result] = await pool.query(query, [data.attribute_id, data.filterable, data.value, data.swatche_type, data.swatche_value, data.status, id]);
    return result.affectedRows > 0;
  }

  static async deleteAttributeValue(id) {
    const query = 'DELETE FROM attribute_values WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = AttributeValue;
