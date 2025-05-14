const pool = require('../config/database'); // Import the database connection

class City {
    static async getAllCities() {
        try {
            const [rows] = await pool.query('SELECT * FROM cities');
            return rows;
        } catch (error) {
            throw new Error('Database query failed');
        }
    }

    static async addCity(data) {
        try {
            const query = `INSERT INTO cities (name, latitude, longitude, min_order_amount_for_free_delivery, time_to_travel, max_deliverable_distance, delivery_charge_method, fixed_charge, per_km_charge, range_wise_charges, geolocation_type, radius, boundary_points, bordering_city_ids) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                data.cityName, // Use cityName instead of name
                data.latitude,
                data.longitude,
                data.minOrderAmount, // Use minOrderAmount instead of min_order_amount_for_free_delivery
                data.timeToTravel, // Use timeToTravel instead of time_to_travel
                data.maxDistance, // Use maxDistance instead of max_deliverable_distance
                data.chargeMethod, // Use chargeMethod instead of delivery_charge_method
                data.fixedCharge || 0, // Default to 0 if not provided
                data.perKmCharge || 0, // Default to 0 if not provided
                data.rangeWiseCharges || null, // Default to null if not provided
                data.geolocationType || null, // Default to null if not provided
                data.radius || 0, // Default to 0 if not provided
                data.boundaryPoints || null, // Default to null if not provided
                data.borderingCityIds || null // Default to null if not provided
            ];
            const [result] = await pool.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Database Error:', error); // Log the database error for debugging
            throw new Error('Failed to add city');
        }
    }

    static async updateCity(id, data) {
        try {
            const query = `UPDATE cities SET name = ?, latitude = ?, longitude = ?, min_order_amount_for_free_delivery = ?, time_to_travel = ?, max_deliverable_distance = ?, delivery_charge_method = ?, charges = ?, bordering_city_ids = ? WHERE id = ?`;
            const values = [
                data.name,
                data.latitude,
                data.longitude,
                data.min_order_amount_for_free_delivery,
                data.time_to_travel,
                data.max_deliverable_distance,
                data.delivery_charge_method,
                data.charges,
                data.bordering_city_ids,
                id
            ];
            const [result] = await pool.query(query, values);
            return result.affectedRows;
        } catch (error) {
            throw new Error('Failed to update city');
        }
    }

    static async deleteCity(id) {
        try {
            const query = 'DELETE FROM cities WHERE id = ?';
            const [result] = await pool.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            throw new Error('Failed to delete city');
        }
    }
}

module.exports = City;
