const db = require('../config/database');

const ProductAttributes = {
  create: (data, callback) => {
    const query = 'INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES (?, ?, ?)';
    db.query(query, [data.product_id, data.attribute_name, data.attribute_value], callback);
  },

  findByProductId: (productId, callback) => {
    const query = 'SELECT * FROM product_attributes WHERE product_id = ?';
    db.query(query, [productId], callback);
  },

  deleteByProductId: (productId, callback) => {
    const query = 'DELETE FROM product_attributes WHERE product_id = ?';
    db.query(query, [productId], callback);
  }
};

module.exports = ProductAttributes;
