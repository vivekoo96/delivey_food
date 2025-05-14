const pool = require('../config/database');

class BranchTimings {
    static async addTiming(data) {
        try {
            const query = `INSERT INTO branch_timings (branch_id, day, opening_time, closing_time, is_open) 
                           VALUES (?, ?, ?, ?, ?)`;
            const values = [
                data.branch_id,
                data.day,
                data.opening_time,
                data.closing_time,
                data.is_open ? 1 : 0
            ];
            console.log('Executing query:', query);
            console.log('With values:', values);
            const [result] = await pool.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error in addTiming:', error);
            throw new Error('Failed to add branch timing');
        }
    }

    static async getTimingsByBranchId(branchId) {
        try {
            const query = `SELECT * FROM branch_timings WHERE branch_id = ?`;
            const [rows] = await pool.query(query, [branchId]);
            return rows;
        } catch (error) {
            throw new Error('Failed to fetch branch timings');
        }
    }

    static filterValidTimings(timings) {
        return timings.filter((timing) => timing.opening_time && timing.closing_time).map((timing) => ({
            branch_id: timing.branch_id,
            day: timing.day,
            opening_time: timing.opening_time,
            closing_time: timing.closing_time,
            is_open: 1,
        }));
    }
}

module.exports = BranchTimings;
