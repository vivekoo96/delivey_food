const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');

router.post('/', taxController.addTax);
router.get('/', taxController.getAllTaxes);
router.put('/:id', taxController.updateTax);
router.delete('/:id', taxController.deleteTax);

module.exports = router;
