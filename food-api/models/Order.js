const pool = require('../config/database');

class Order {
    static async createOrder(data) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const query = `INSERT INTO orders (userId, branchId, status, items, totalAmount, createdAt, updatedAt)
                           VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
            const [result] = await connection.query(query, [
                data.userId,
                data.branchId,
                data.status,
                JSON.stringify(data.items),
                data.totalAmount
            ]);

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getOrderById(orderId) {
        const query = 'SELECT * FROM orders WHERE id = ?';
        const [rows] = await pool.query(query, [orderId]);
        return rows[0];
    }

    static async updateOrderStatus(orderId, status) {
        const query = 'UPDATE orders SET status = ?, updatedAt = NOW() WHERE id = ?';
        const [result] = await pool.query(query, [status, orderId]);
        return result.affectedRows > 0;
    }

    static async deleteOrder(orderId) {
        const query = 'DELETE FROM orders WHERE id = ?';
        const [result] = await pool.query(query, [orderId]);
        return result.affectedRows > 0;
    }
}

module.exports = Order;
