const pool = require('../config/database'); // Import the database connection

class Branch {
    static async getAllBranches() {
        try {
            const query = `
                SELECT branch.*, cities.name AS city_name 
                FROM branch 
                LEFT JOIN cities ON branch.city_id = cities.id
            `;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            throw new Error('Database query failed');
        }
    }

    static async addBranch(data) {
        try {
            const query = `INSERT INTO branch (branch_name, description, address, city_id, latitude, longitude, email, contact, status, image, self_pickup, deliver_orders, default_branch, global_branch_time) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                data.branch_name,
                data.description,
                data.address,
                data.city_id,
                data.latitude,
                data.longitude,
                data.email,
                data.contact,
                data.status,
                data.image,
                data.self_pickup,
                data.deliver_orders,
                data.default_branch,
                data.global_branch_time
            ];
            console.log('Executing query:', query);
            console.log('With values:', values);
            const [result] = await pool.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error in addBranch:', error);
            console.error('Error details:', error);
            throw new Error('Failed to add branch');
        }
    }

    static async updateBranch(id, data) {
        try {
            const query = `UPDATE branch SET branch_name = ?, description = ?, address = ?, city = ?, latitude = ?, longitude = ?, email = ?, contact = ?, status = ?, branch_image = ?, working_time = ?, self_pickup = ?, deliver_orders = ?, default_branch = ? WHERE id = ?`;
            const values = [
                data.branch_name,
                data.description,
                data.address,
                data.city,
                data.latitude,
                data.longitude,
                data.email,
                data.contact,
                data.status,
                data.branch_image,
                data.working_time,
                data.self_pickup,
                data.deliver_orders,
                data.default_branch,
                id
            ];
            const [result] = await pool.query(query, values);
            return result.affectedRows;
        } catch (error) {
            throw new Error('Failed to update branch');
        }
    }

    static async deleteBranch(id) {
        try {
            const query = 'DELETE FROM branch WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw new Error('Failed to delete branch');
        }
    }
}

module.exports = Branch;
