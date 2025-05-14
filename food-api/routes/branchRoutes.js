const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const branchController = require('../controllers/branchController');

// Get all branches
router.get('/', async (req, res) => {
    try {
        const branches = await Branch.getAllBranches();
        res.json({ error: false, data: branches });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Fetch all branches
router.get('/branches', branchController.getAllBranches);

// Add a new branch
router.post('/', branchController.addBranch);

// Update a branch
router.put('/:id', async (req, res) => {
    try {
        const updatedRows = await Branch.updateBranch(req.params.id, req.body);
        if (updatedRows > 0) {
            res.json({ error: false, message: 'Branch updated successfully' });
        } else {
            res.status(404).json({ error: true, message: 'Branch not found' });
        }
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Delete a branch
router.delete('/:id', async (req, res) => {
    try {
        const deletedRows = await Branch.deleteBranch(req.params.id);
        if (deletedRows > 0) {
            res.json({ error: false, message: 'Branch deleted successfully' });
        } else {
            res.status(404).json({ error: true, message: 'Branch not found' });
        }
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

module.exports = router;
