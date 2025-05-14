const db = require('../config/database');

// Helper to get a single value from a query
async function getSingleValue(query, params = []) {
  const [rows] = await db.query(query, params);
  return rows[0] ? Object.values(rows[0])[0] : 0;
}

exports.index = async (req, res) => {

  const branchId = req.session ? req.session.branch_id : null;
  if (!branchId) {
    return res.redirect('/api/branches');
  }

  try {
    // Dashboard metrics
    const [settings] = await db.query('SELECT * FROM system_settings LIMIT 1');
    const [currencyRow] = await db.query('SELECT value FROM settings WHERE key_name = "currency" LIMIT 1');
    const currency = currencyRow ? currencyRow.value : '';

    const orderCounter = await getSingleValue('SELECT COUNT(id) as counter FROM orders WHERE branch_id = ?', [branchId]);
    const userCounter = await getSingleValue('SELECT COUNT(u.id) as counter FROM users u JOIN users_groups ug ON ug.user_id = u.id WHERE ug.group_id=2');
    const riderCounter = await getSingleValue('SELECT COUNT(u.id) as counter FROM users u JOIN users_groups ug ON ug.user_id = u.id WHERE ug.group_id=3 AND u.branch_id = ?', [branchId]);
    const branchCounter = await getSingleValue('SELECT COUNT(id) as counter FROM branch');
    const countProductsLowStatus = await getSingleValue(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM products p
       LEFT JOIN product_variants pv ON pv.product_id = p.id
       WHERE p.stock_type IS NOT NULL
         AND (p.stock <= 5 OR pv.stock <= 5)
         AND (p.availability = 1 OR pv.availability = 1)
         AND p.branch_id = ?`, [branchId]
    );
    const countProductsAvailabilityStatus = await getSingleValue(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM products p
       JOIN product_variants pv ON pv.product_id = p.id
       WHERE p.stock_type IS NOT NULL
         AND p.branch_id = ?
         AND (p.stock = 0 OR pv.stock = 0)
         AND (p.availability = 0 OR pv.availability = 0)`, [branchId]
    );
    const branchTotalEarnings = await getSingleValue(
      'SELECT SUM(final_total) as total FROM orders WHERE active_status = "delivered" AND branch_id = ?', [branchId]
    );
    const totalEarnings = await getSingleValue(
      'SELECT SUM(final_total) as total FROM orders WHERE active_status = "delivered"'
    );
    const [topEarningBranchRow] = await db.query(
      `SELECT branch.branch_name AS branch_name, SUM(orders.final_total) AS total_earnings
       FROM orders
       INNER JOIN branch ON orders.branch_id = branch.id
       WHERE orders.active_status = "delivered"
       GROUP BY orders.branch_id
       ORDER BY total_earnings DESC
       LIMIT 1`
    );
    const topEarningBranch = topEarningBranchRow ? topEarningBranchRow.branch_name : null;

    const [topFoods] = await db.query(
      `SELECT p.id, p.name, p.image, SUM(oi.quantity) as total_sales, SUM(oi.price * oi.quantity) as total_amount
       FROM order_items oi
       JOIN product_variants pv ON oi.product_variant_id = pv.id
       JOIN products p ON pv.product_id = p.id
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.branch_id = ? AND o.active_status = "delivered"
       GROUP BY oi.product_variant_id
       ORDER BY total_sales DESC
       LIMIT 3`, [branchId]
    );

    // Order status counts
    const statuses = [
      'awaiting', 'pending', 'confirmed', 'preparing', 'ready_for_pickup',
      'out_for_delivery', 'delivered', 'cancelled', 'draft'
    ];
    const statusCounts = {};
    for (const status of statuses) {
      statusCounts[status] = await getSingleValue(
        'SELECT COUNT(id) as counter FROM orders WHERE active_status = ? AND branch_id = ?', [status, branchId]
      );
    }

    // Super admin check (replace with your actual logic)
    const isSuperAdmin = req.user && req.user.role === 'super_admin';

    // Respond with dashboard data
    res.json({
      main_page: 'home',
      title: `Admin Panel | ${settings[0]?.app_name || ''}`,
      meta_description: `Admin Panel | ${settings[0]?.app_name || ''}`,
      currency,
      order_counter: orderCounter,
      user_counter: userCounter,
      rider_counter: riderCounter,
      branch_counter: branchCounter,
      count_products_low_status: countProductsLowStatus,
      count_products_availability_status: countProductsAvailabilityStatus,
      branch_total_earnings: branchTotalEarnings,
      total_earnings: totalEarnings,
      top_earning_branch: topEarningBranch,
      top_foods: topFoods,
      is_super_admin: isSuperAdmin,
      status_counts: statusCounts
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};