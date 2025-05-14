const db = require('../config/database');

const ProductTags = {
  create: (data, callback) => {
    const query = 'INSERT INTO product_tags (product_id, tag_id) VALUES (?, ?)';
    db.query(query, [data.product_id, data.tag_id], callback);
  },

  findByProductId: (productId, callback) => {
    const query = 'SELECT pt.*, t.title FROM product_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.product_id = ?';
    db.query(query, [productId], callback);
  },

  deleteByProductId: (productId, callback) => {
    const query = 'DELETE FROM product_tags WHERE product_id = ?';
    db.query(query, [productId], callback);
  }
};

module.exports = ProductTags;
