const pool = require('../config/database');

class Attribute {
    static async createAttribute(data) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Insert into attributes table
            const query = 'INSERT INTO attributes (name, type, status, date_created) VALUES (?, ?, ?, NOW())';
            const [result] = await connection.query(query, [data.name, data.type || null, data.status || 1]);
            const attributeId = result.insertId;

            // Insert into attribute_values table
            const insertValueQuery = 'INSERT INTO attribute_values (attribute_id, value, status) VALUES (?, ?, ?)';
            for (const value of data.values) {
                await connection.query(insertValueQuery, [attributeId, value, 1]);
            }

            await connection.commit();
            return attributeId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAllAttributes() {
        const query = 'SELECT id, name, type, status, date_created FROM attributes ORDER BY id ASC';
        const [rows] = await pool.query(query);
        return rows;
    }

    static async updateAttribute(id, data) {
        const query = 'UPDATE attributes SET name = ?, type = ?, status = ? WHERE id = ?';
        const [result] = await pool.query(query, [data.name, data.type, data.status, id]);
        return result.affectedRows > 0;
    }

    static async deleteAttribute(id) {
        const query = 'DELETE FROM attributes WHERE id = ?';
        const [result] = await pool.query(query, [id]);
        return result.affectedRows > 0;
    }

    static async addOrUpdateAttribute(data) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            if (data.edit_attribute_id) {
                // Update attribute
                const updateQuery = 'UPDATE attributes SET name = ?, type = ?, status = ? WHERE id = ?';
                await connection.query(updateQuery, [data.name, data.type || null, data.status || 1, data.edit_attribute_id]);

                // First, delete all existing values for this attribute
                await connection.query('DELETE FROM attribute_values WHERE attribute_id = ?', [data.edit_attribute_id]);

                // Then insert the new values as complete strings
                if (data.values && typeof data.values === 'string') {
                    const insertValueQuery = 'INSERT INTO attribute_values (attribute_id, value, status) VALUES (?, ?, ?)';
                    const valuesArray = data.values.split(',').map(v => v.trim()).filter(v => v); // Split by comma, trim, and filter empty values
                    for (const value of valuesArray) {
                        if (value) {
                            await connection.query(insertValueQuery, [data.edit_attribute_id, value, 1]);
                        }
                    }
                }
            } else {
                // Insert new attribute
                const insertQuery = 'INSERT INTO attributes (name, type, status, date_created) VALUES (?, ?, ?, NOW())';
                const [result] = await connection.query(insertQuery, [data.name, data.type || null, data.status || 1]);
                const attributeId = result.insertId;

                // Insert attribute values as complete strings
                if (data.values && typeof data.values === 'string') {
                    const insertValueQuery = 'INSERT INTO attribute_values (attribute_id, value, status) VALUES (?, ?, ?)';
                    const valuesArray = data.values.split(',').map(v => v.trim()).filter(v => v); // Split by comma, trim, and filter empty values
                    for (const value of valuesArray) {
                        if (value) {
                            await connection.query(insertValueQuery, [attributeId, value, 1]);
                        }
                    }
                }
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAttributes({ offset = 0, limit = 10, sort = 'id', order = 'DESC', search = '' }) {
        const query = `
            SELECT attr.*, GROUP_CONCAT(av.value SEPARATOR ', ') AS attribute_values
            FROM attributes attr
            LEFT JOIN attribute_values av ON av.attribute_id = attr.id AND av.status = 1
            WHERE attr.name LIKE ? OR av.value LIKE ?
            GROUP BY attr.id
            ORDER BY ${sort} ${order}
            LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(query, [`%${search}%`, `%${search}%`, limit, offset]);
        
        // Format the attribute_values as an array
        return rows.map(row => ({
            ...row,
            attribute_values: row.attribute_values ? row.attribute_values.split(', ') : []
        }));
    }
}

module.exports = Attribute;