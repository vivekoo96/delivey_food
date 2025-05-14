const City = require('../models/City');

// Get all cities
exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.getAllCities();
        res.json({ error: false, data: cities });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

// Add a new city
exports.addCity = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the incoming request body
        const cityId = await City.addCity(req.body);
        res.json({ error: false, message: 'City added successfully', cityId });
    } catch (error) {
        console.error('Error in addCity:', error); // Log the error details
        res.status(500).json({ error: true, message: error.message });
    }
};

// Update a city
exports.updateCity = async (req, res) => {
    try {
        const updatedRows = await City.updateCity(req.params.id, req.body);
        if (updatedRows > 0) {
            res.json({ error: false, message: 'City updated successfully' });
        } else {
            res.status(404).json({ error: true, message: 'City not found' });
        }
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

// Delete a city
exports.deleteCity = async (req, res) => {
    try {
        const deletedRows = await City.deleteCity(req.params.id);
        if (deletedRows > 0) {
            res.json({ error: false, message: 'City deleted successfully' });
        } else {
            res.status(404).json({ error: true, message: 'City not found' });
        }
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};
