const fs = require("fs");
const csv = require("csv-parser");
const db = require("../config/database"); // Use the pool directly

const processBulkUpload = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          for (const row of results) {
            // Validate required fields
            if (!row.category_id || !row.name || !row.type) {
              throw new Error(`Missing required fields in row: ${JSON.stringify(row)}`);
            }

            if (row.type !== "simple_product" && row.type !== "variable_product") {
              throw new Error(`Invalid product type in row: ${JSON.stringify(row)}`);
            }

            if (row.type === "simple_product" && row.attribute_value_ids) {
              throw new Error(`Simple products cannot have attribute values in row: ${JSON.stringify(row)}`);
            }

            // Insert product into the database
            const productData = {
              category_id: row.category_id,
              type: row.type,
              name: row.name,
              short_description: row.short_description || "",
              indicator: row.indicator || 0,
              calories: row.calories || 0,
              cod_allowed: row["cod_allowed"] || 1,
              minimum_order_quantity: row["minimum order quantity"] || 1,
              total_allowed_quantity: row["total allowed quantity"] || null,
              is_cancelable: row["is cancelable"] || 0,
              cancelable_till: row["cancelable till"] || null,
              image: row.image || "",
              stock: row.stock || null,
              availability: row.availability || null,
              branch_id: row.branch_id || null,
              slug: row.slug || row.name.toLowerCase().replace(/\s+/g, '-'),
            };

            const [productResult] = await db.query("INSERT INTO products SET ?", productData);

            // Insert product tags
            if (row["tag id"]) {
              const tagData = {
                product_id: productResult.insertId,
                tag_id: row["tag id"],
              };
              await db.query("INSERT INTO product_tags SET ?", tagData);
            }

            // Insert product variants for variable products
            if (row.type === "variable_product") {
              const variants = [];

              for (let i = 0; i < 50; i++) {
                const attributeValueIds = row[`attribute value ids_${i}`];
                const price = row[`price_${i}`];
                const specialPrice = row[`special price_${i}`] || 0;
                const stock = row[`stock_${i}`] || null;
                const availability = row[`availability_${i}`] || null;

                if (attributeValueIds && price) {
                  variants.push({
                    product_id: productResult.insertId,
                    attribute_value_ids: attributeValueIds,
                    price,
                    special_price: specialPrice,
                    stock,
                    availability,
                  });
                }
              }

              for (const variant of variants) {
                await db.query("INSERT INTO product_variants SET ?", variant);
              }

              if (variants.length === 0) {
                throw new Error(`No variants found for variable product in row: ${JSON.stringify(row)}`);
              }
            }
          }
          resolve("Bulk upload completed successfully.");
        } catch (error) {
          reject(error.message);
        }
      })
      .on("error", (error) => {
        reject(error.message);
      });
  });
};

module.exports = { processBulkUpload };
