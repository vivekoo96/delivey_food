const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

// Get all cities
router.get('/', cityController.getAllCities);

// Add a new city
router.post('/', cityController.addCity);

// Update a city
router.put('/:id', cityController.updateCity);

// Delete a city
router.delete('/:id', cityController.deleteCity);

module.exports = router;
