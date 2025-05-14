const db = require('../config/database');
// const ProductTags = require('./ProductTags');

const ProductAddOns = {
  create: (data, callback) => {
    const query = 'INSERT INTO product_add_ons (product_id, title, price) VALUES (?, ?, ?)';
    db.query(query, [data.product_id, data.title, data.price], callback);
  },

  findByProductId: (productId, callback) => {
    const query = 'SELECT * FROM product_add_ons WHERE product_id = ?';
    db.query(query, [productId], callback);
  },

  deleteByProductId: (productId, callback) => {
    const query = 'DELETE FROM product_add_ons WHERE product_id = ?';
    db.query(query, [productId], callback);
  }
};

module.exports = ProductAddOns;
