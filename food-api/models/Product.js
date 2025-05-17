const db = require("../config/database");

const Product = {
  add: async (productData, tagsArray, addOns, variants, attributeValues) => {
    const cleanData = (data) => {
      const cleaned = {};
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== '') {
          cleaned[key] = data[key];
        }
      }
      return cleaned;
    };

    // Parse JSON strings if they are passed as strings
    const safeParse = (input, fallback = []) => {
      if (typeof input === 'string') {
        try {
          return JSON.parse(input);
        } catch (e) {
          console.error('❌ Failed to parse JSON:', input);
          return fallback;
        }
      }
      return input || fallback;
    };

    tagsArray = safeParse(tagsArray, []);
    addOns = safeParse(addOns, []);
    variants = safeParse(variants, []);
    attributeValues = typeof attributeValues === 'string' ? attributeValues : JSON.stringify(attributeValues || []);

    try {
      const cleanedProductData = cleanData(productData);
      const [result] = await db.query(`INSERT INTO products SET ?`, cleanedProductData);
      const productId = result.insertId;
      console.log('✅ product_id:', productId);

      // Insert product_tags
      if (Array.isArray(tagsArray) && tagsArray.length) {
        const tagValues = tagsArray.map(tagId => [productId, tagId]);
        await db.query(`INSERT INTO product_tags (product_id, tag_id) VALUES ?`, [tagValues]);
      }

      // Insert product_add_ons
      if (Array.isArray(addOns) && addOns.length) {
        const addOnValues = addOns.map(addOn => [
          productId,
          addOn.title || '',
          addOn.description || '',
          addOn.price || 0,
          addOn.calories || 0,
          addOn.status ?? 1
        ]);
        await db.query(
          `INSERT INTO product_add_ons (product_id, title, description, price, calories, status) VALUES ?`,
          [addOnValues]
        );
      }

      // Insert product_attributes
      if (attributeValues) {
        await db.query(
          `INSERT INTO product_attributes (product_id, attribute_value_ids) VALUES (?, ?)`,
          [productId, attributeValues]
        );
      }

      // Insert product_variants
      if (Array.isArray(variants) && variants.length) {
        const variantValues = variants.map(variant => [
          productId,
          variant.price || 0,
          variant.special_price || 0,
          variant.attribute_value_ids || '',
          variant.stock || 0,
          variant.availability ?? 1,
          variant.status ?? 1
        ]);
        await db.query(
          `INSERT INTO product_variants (product_id, price, special_price, attribute_value_ids, stock, availability, status) VALUES ?`,
          [variantValues]
        );
      }

      return { success: true, product_id: productId };
    } catch (error) {
      console.error('❌ Error inserting product:', error);
      throw error;
    }
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
