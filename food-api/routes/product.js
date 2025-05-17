const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const ticketController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Routes
router.post(
  "/add",
  upload.single("mainImage"),
  (req, res, next) => {
    console.log("✅ Middleware hit: file and body received");
    next();
  },
  async (req, res, next) => {
    try {
      console.log("✅ Controller called");
      await productController.addProduct(req, res);
    } catch (err) {
      console.error("❌ Error in route handler:", err);
      res.status(500).json({ success: false, message: "Unexpected server error", error: err.message });
    }
  }
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
