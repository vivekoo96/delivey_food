const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');

// Configure multer to save files to the 'uploads' directory

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Add file type and size validation
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2MB
  },
});

// Define the fields multer should expect
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

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the frontend
  credentials: true, // Allow cookies and other credentials
}));

// Serve the 'uploads' folder publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debugging middleware to log incoming FormData fields
app.use((req, res, next) => {
  if (req.method === 'POST' && req.headers['content-type']?.includes('multipart/form-data')) {
    console.log('FormData fields:', req.body);
    console.log('Files:', req.files);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const adminHomeRoutes = require('./routes/adminHome');
app.use('/api', adminHomeRoutes);
const branchRoutes = require('./routes/branchRoutes');
app.use('/api/branches', branchRoutes);
const cityRoutes = require('./routes/cityRoutes');
app.use('/api/cities', cityRoutes);  
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryUpload, categoryRoutes);

const tagsRoutes = require('./routes/tagsRoutes');
app.use('/api/tags', tagsRoutes);

const taxRoutes = require('./routes/taxRoutes');
app.use('/api/taxes', taxRoutes);

const attributeRoutes = require('./routes/attributeRoutes');
app.use('/api/attributes', attributeRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/orders', orderRoutes);

const productRoutes = require('./routes/product');
app.use("/api/products", productRoutes);

const ticketTypesRoutes = require('./routes/ticketTypes');
app.use('/api', ticketTypesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { categoryUpload };