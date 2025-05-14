const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth'); // Middleware for authentication
const Branch = require('../models/Branch');
const BranchTimings = require('../models/BranchTimings');
const pool = require('../config/database');

const truncateString = (str, maxLength) => (str && str.length > maxLength ? str.substring(0, maxLength) : str);

exports.addBranch = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const branchData = {
      branch_name: truncateString(req.body.branch_name, 20),
      description: truncateString(req.body.description, 1024),
      address: truncateString(req.body.address, 1024),
      city_id: parseInt(req.body.city_id, 10),
      latitude: truncateString(req.body.latitude, 64),
      longitude: truncateString(req.body.longitude, 64),
      email: truncateString(req.body.email, 20),
      contact: parseFloat(req.body.contact),
      image: truncateString(req.body.image, 1028),
      status: req.body.status ? 1 : 0,
      self_pickup: req.body.self_pickup ? 1 : 0,
      deliver_orders: req.body.deliver_orders ? 1 : 0,
      default_branch: parseInt(req.body.default_branch, 10),
      global_branch_time: req.body.global_branch_time ? 1 : 0,
    };

    console.log('Validated Branch data:', branchData);
    console.log('Branch data before insertion:', branchData);

    try {
      console.log('Inserting branch data:', branchData);
      const branchId = await Branch.addBranch(branchData);
      console.log('Branch inserted with ID:', branchId);

      const validTimings = BranchTimings.filterValidTimings(req.body.timings.map((timing) => ({
        ...timing,
        branch_id: branchId,
        day: truncateString(timing.day, 20),
      })));

      console.log('Filtered and Validated Timings data:', validTimings);

      try {
        for (const timing of validTimings) {
          console.log('Inserting timing:', timing);
          await BranchTimings.addTiming(timing);
        }
      } catch (error) {
        console.error('Error inserting timing:', error);
        throw new Error('Failed to insert branch timings');
      }

      await connection.commit();
      res.status(201).json({ success: true, message: 'Branch and timings added successfully' });
    } catch (error) {
      console.error('Error inserting branch:', error);
      await connection.rollback();
      res.status(500).json({ success: false, message: 'Failed to add branch' });
    }
  } catch (error) {
    console.error('Error in addBranch controller:', error);
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Fetch all branches
exports.getAllBranches = (req, res) => {
  Branch.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};
