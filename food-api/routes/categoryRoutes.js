const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const multer = require('multer');
const path = require('path');

// Configure multer to save files to the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });
const categoryUpload = upload.fields([
  { name: 'name', maxCount: 1 },
  { name: 'description', maxCount: 1 },
  { name: 'branch_id', maxCount: 1 },
  { name: 'slug', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'row_order', maxCount: 1 },
  { name: 'status', maxCount: 1 },
  { name: 'parent_id', maxCount: 1 },
]);

// Route to add a category
router.post('/add', categoryUpload, categoryController.addCategory);

// Route to get all categories
router.get('/all', categoryController.getAllCategories);

// Route to delete a category
router.delete('/:id', categoryController.deleteCategory);

// Route to edit a category
router.put('/:id', categoryUpload, categoryController.editCategory);

module.exports = router;
