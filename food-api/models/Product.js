const db = require("../config/database");
const ProductTags = require("./ProductTags");

const Product = {
  add: (productData, callback) => {
       const sql = `
      INSERT INTO products (
        id, category_id, branch_id, tax, row_order, type, stock_type, name, short_description, slug,
        indicator, calories, cod_allowed, available_time, start_time, end_time, minimum_order_quantity,
        quantity_step_size, total_allowed_quantity, is_prices_inclusive_tax, is_returnable, is_cancelable,
        is_spicy, cancelable_till, image, other_images, video_type, video, highlights, warranty_period,
        guarantee_period, made_in, sku, stock, availability, rating, no_of_ratings, description,
        deliverable_type, deliverable_zipcodes, status, date_added
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;

    const values = [
      productData.id || null,
      productData.category_id || null,
      productData.branch_id || null,
      productData.tax || null,
      productData.row_order || 0,
      productData.type || null,
      productData.stock_type || null,
      productData.name || null,
      productData.short_description || null,
      productData.slug || null,
      productData.indicator || null,
      productData.calories || null,
      productData.cod_allowed || 0,
      productData.available_time || null,
      productData.start_time || null,
      productData.end_time || null,
      productData.minimum_order_quantity || null,
      productData.quantity_step_size || 1,
      productData.total_allowed_quantity || null,
      productData.is_prices_inclusive_tax || 0,
      productData.is_returnable || 0,
      productData.is_cancelable || 0,
      productData.is_spicy || 0,
      productData.cancelable_till || null,
      productData.image || null,
      productData.other_images || null,
      productData.video_type || null,
      productData.video || null,
      productData.highlights || null,
      productData.warranty_period || null,
      productData.guarantee_period || null,
      productData.made_in || null,
      productData.sku || null,
      productData.stock || null,
      productData.availability || null,
      productData.rating || 0,
      productData.no_of_ratings || 0,
      productData.description || null,
      productData.deliverable_type || 1,
      productData.deliverable_zipcodes || null,
      productData.status || 1,
      productData.date_added || new Date()
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err);
      }

      const productId = result.insertId;

      // Insert tags into the product_tags table
      if (productData.tags && Array.isArray(productData.tags) && productData.tags.length > 0) {
        const tagSql = `INSERT INTO product_tags (product_id, tag_id) VALUES ?`;
        const tagValues = productData.tags.map((tagId) => [productId, tagId]);

        db.query(tagSql, [tagValues], (tagErr) => {
          if (tagErr) {
            return callback(tagErr);
          }
          callback(null, result);
        });
      } else {
        callback(null, result);
      }
    });
  },

  getAll: (callback) => {
    const sql = "SELECT * FROM products";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [id], callback);
  },

  update: (id, productData, callback) => {
    const sql = `UPDATE products SET name = ?, category_id = ?, short_description = ?, tax = ?, cod_allowed = ?, is_cancelable = ?, cancelable_till = ?, is_spicy = ?, image = ?, tags = ?, highlights = ?, calories = ?, total_allowed_quantity = ?, minimum_order_quantity = ?, available_time = ?, start_time = ?, end_time = ?, slug = ? WHERE id = ?`;
    const values = [
      productData.name,
      productData.category_id,
      productData.shortDescription,
      productData.tax,
      productData.codAllowed,
      productData.isCancelable,
      productData.cancelableTill,
      productData.isSpicy,
      productData.image,
      productData.tags,
      productData.highlights,
      productData.calories,
      productData.totalAllowedQuantity,
      productData.minimumOrderQuantity,
      productData.availableTime,
      productData.startTime,
      productData.endTime,
      productData.slug,
      id,
    ];
    db.query(sql, values, callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = Product;
