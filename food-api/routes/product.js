const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const ticketController = require('../controllers/productController');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post(
  "/add",
  upload.single("mainImage"), // This must run first
  (req, res, next) => {
    // console.log("Incoming headers:", req.headers);
    // console.log("Incoming fields (req.body):", req.body);
    // console.log("Incoming files (req.file):", req.file);
    next();
  },
  productController.addProduct
);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", upload.single("mainImage"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

router.post("/bulk-upload", upload.single("uploadFile"), productController.bulkUpload);
router.post('/order', productController.updateProductOrder);

// Add a new route for slider uploads
router.post(
  "/slider",
  upload.single("image"),
  productController.addSlider
);

// Ticket Type Routes
router.post('/ticket-type', ticketController.addTicketType);
router.get('/ticket-types', ticketController.getTicketTypes);

module.exports = router;
