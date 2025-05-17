const Product = require("../models/Product");
const ProductAddOns = require("../models/ProductAddOns");
const ProductAttributes = require("../models/ProductAttributes");
const ProductTags = require("../models/ProductTags");
const { processBulkUpload } = require("../services/bulkUploadService");
const TicketType = require('../models/TicketType');

// Add a new product with related data
// controllers/productController.js
exports.addProduct = async (req, res) => {
  try {
    const data = req.body;

    const productData = {
      name: data.name,
      short_description: data.short_description,
      slug: generateSlug(data.name),
      type: data.product_type,
      category_id: data.product_category_id,
      branch_id: data.branch_id,
      indicator: data.indicator,
      image: req.file ? req.file.filename : null,
      total_allowed_quantity: data.total_allowed_quantity || null,
      minimum_order_quantity: data.minimum_order_quantity || 1,
      highlights: data.highlights || '',
      calories: data.calories || 0,
      start_time: data.product_start_time || '00:00:00',
      end_time: data.product_end_time || '00:00:00',
      tax: data.pro_input_tax || 0,
      stock_type: determineStockType(data),
      stock: data.product_total_stock || null,
      availability: data.simple_product_stock_status || null,
      sku: data.product_sku || null,
      cod_allowed: data.cod_allowed ? 1 : 0,
      available_time: data.available_time ? 1 : 0,
      is_cancelable: data.is_cancelable ? 1 : 0,
      cancelable_till: data.cancelable_till || '',
      is_spicy: data.is_spicy ? 1 : 0,
      is_prices_inclusive_tax: 0,
    };

    const tagsArray = data.tags || [];
    const addOns = data.product_add_ons || [];
    const variants = data.variants || [];
    const attributeValues = data.attribute_values || null;

    const result = await Product.add(productData, tagsArray, addOns, variants, attributeValues);
    console.log(result);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result
    });

  } catch (err) {
    console.error("Error in addProduct:", err);
    return res.status(500).json({
      success: false,
      message: "Product creation failed",
      error: err.message
    });
  }
};


function generateSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
}

function determineStockType(data) {
  if (data.product_type === 'simple_product') {
    return data.simple_product_stock_status ? 0 : null;
  } else if (data.variant_stock_level_type) {
    return data.variant_stock_level_type === 'product_level' ? 1 : 2;
  }
  return null;
}



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

