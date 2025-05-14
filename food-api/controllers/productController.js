const Product = require("../models/Product");
const ProductAddOns = require("../models/ProductAddOns");
const ProductAttributes = require("../models/ProductAttributes");
const ProductTags = require("../models/ProductTags");
const { processBulkUpload } = require("../services/bulkUploadService");
const TicketType = require('../models/TicketType');

// Add a new product with related data
exports.addProduct = (req, res) => {
  const productData = req.body;

  productData.id = null; // Ensure `id` is set to null for auto-increment
  productData.category_id = req.body.category_id || null;
  productData.branch_id = req.body.branch_id || null;
  productData.tax = req.body.tax || null;
  productData.row_order = req.body.row_order || 0;
  productData.type = req.body.type || null;
  productData.stock_type = req.body.stock_type || null;
  productData.name = req.body.name || null;
  productData.short_description = req.body.short_description || null;
  productData.slug = req.body.slug || null;
  productData.indicator = req.body.indicator || null;
  productData.calories = req.body.calories || null;
  productData.cod_allowed = req.body.cod_allowed || 0;
  productData.available_time = req.body.available_time || null;
  productData.start_time = req.body.start_time || null;
  productData.end_time = req.body.end_time || null;
  productData.minimum_order_quantity = req.body.minimum_order_quantity || null;
  productData.quantity_step_size = req.body.quantity_step_size || 1;
  productData.total_allowed_quantity = req.body.total_allowed_quantity || null;
  productData.is_prices_inclusive_tax = req.body.is_prices_inclusive_tax || 0;
  productData.is_returnable = req.body.is_returnable || 0;
  productData.is_cancelable = req.body.is_cancelable || 0;
  productData.is_spicy = req.body.is_spicy || 0;
  productData.cancelable_till = req.body.cancelable_till || null;
  productData.image = req.file ? req.file.filename : null;
  productData.other_images = req.body.other_images || null;
  productData.video_type = req.body.video_type || null;
  productData.video = req.body.video || null;
  productData.highlights = req.body.highlights || null;
  productData.warranty_period = req.body.warranty_period || null;
  productData.guarantee_period = req.body.guarantee_period || null;
  productData.made_in = req.body.made_in || null;
  productData.sku = req.body.sku || null;
  productData.stock = req.body.stock || null;
  productData.availability = req.body.availability || null;
  productData.rating = req.body.rating || 0;
  productData.no_of_ratings = req.body.no_of_ratings || 0;
  productData.description = req.body.description || null;
  productData.deliverable_type = req.body.deliverable_type || 1;
  productData.deliverable_zipcodes = req.body.deliverable_zipcodes || null;
  productData.status = req.body.status || 1;
  productData.date_added = new Date();

  // Parse arrays sent as JSON strings
  try {
    productData.addOns = productData.addOns ? JSON.parse(productData.addOns) : [];
    productData.attributes = productData.attributes ? JSON.parse(productData.attributes) : [];
    productData.tags = productData.tags ? JSON.parse(productData.tags) : [];
    productData.product_add_ons = productData.product_add_ons
      ? JSON.parse(productData.product_add_ons)
      : [];
  } catch (parseErr) {
    return res.status(400).json({ error: "Invalid JSON in addOns, attributes, tags, or product_add_ons" });
  }

  // Main image is required
  if (!productData.image) {
    return res.status(400).json({ error: "Main image is required" });
  }

  // Log for debugging
  console.log("Product Data:", productData);

  // Insert the product into the database
  Product.add(productData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const productId = result.insertId || result.id;

    // Add related data (optional, non-blocking)
    if (Array.isArray(productData.addOns)) {
      productData.addOns.forEach((addOn) => {
        ProductAddOns.create({ product_id: productId, ...addOn }, (err) => {
          if (err) console.error("Error adding add-on:", err.message);
        });
      });
    }

    if (Array.isArray(productData.attributes)) {
      productData.attributes.forEach((attribute) => {
        ProductAttributes.create({ product_id: productId, ...attribute }, (err) => {
          if (err) console.error("Error adding attribute:", err.message);
        });
      });
    }

    if (Array.isArray(productData.tags)) {
      productData.tags.forEach((tag) => {
        ProductTags.create({ product_id: productId, tag_id: tag }, (err) => {
          if (err) console.error("Error adding tag:", err.message);
        });
      });
    }

    res.status(201).json({ message: "Product added successfully", productId });
  });
};



// Get all products
exports.getProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Get a single product by ID with related data
exports.getProductById = (req, res) => {
  const { id } = req.params;
  Product.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = results[0];

    ProductAddOns.findByProductId(id, (err, addOns) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      ProductAttributes.findByProductId(id, (err, attributes) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        ProductTags.findByProductId(id, (err, tags) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.status(200).json({ ...product, addOns, attributes, tags });
        });
      });
    });
  });
};

// Update a product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  productData.mainImage = req.file ? req.file.filename : null;

  Product.update(id, productData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Product updated successfully" });
  });
};

// Delete a product
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  Product.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  });
};



// Bulk upload products
exports.bulkUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Process the uploaded CSV file
    const message = await processBulkUpload(filePath);

    res.status(200).json({ message });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update product order
exports.updateProductOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Invalid products data' });
    }

    const updatePromises = products.map((product) => {
      return db.query('UPDATE products SET row_order = ? WHERE id = ?', [product.row_order, product.id]);
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Product order updated successfully' });
  } catch (error) {
    console.error('Error updating product order:', error);
    res.status(500).json({ error: 'Failed to update product order' });
  }
};

// Add a new controller for handling slider uploads
exports.addSlider = (req, res) => {
  const { type, branch } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!type || !branch || !image) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Simulate saving slider data to the database
  const sliderData = {
    type,
    branch,
    image,
    createdAt: new Date(),
  };

  console.log("Slider Data Saved:", sliderData);

  return res.status(201).json({ message: "Slider added successfully.", slider: sliderData });
};

// Add a new ticket type
exports.addTicketType = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTicketType = new TicketType({ title });
    await newTicketType.save();

    res.status(201).json({ message: 'Ticket type added successfully', ticketType: newTicketType });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all ticket types
exports.getTicketTypes = async (req, res) => {
  try {
    const ticketTypes = await TicketType.find();
    res.status(200).json(ticketTypes);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

