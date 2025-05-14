const express = require('express');
const router = express.Router();
const AttributeController = require('../controllers/attributeController');

// Get all attributes
router.get('/', AttributeController.getAttributes);

// Add a new attribute
router.post('/', AttributeController.addAttribute);

// Add or update an attribute
router.post('/add-or-update', AttributeController.addOrUpdateAttribute);

// Update an attribute
router.put('/:id', AttributeController.updateAttribute);

// Delete an attribute
router.delete('/:id', AttributeController.deleteAttribute);

module.exports = router;
