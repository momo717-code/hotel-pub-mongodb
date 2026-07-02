// =====================================================================
//  Hotel & Pub Management — MongoDB queries, grouped by user role
//  Run in mongosh against the `hotel_pub_management` database.
// =====================================================================

// ------------------------- MANAGER QUERIES ---------------------------

// All confirmed bookings
db.bookings.find({ status: "confirmed" });

// All bookings for a given hotel
db.bookings.find({ hotel_id: 1 });

// All employees at a given hotel
db.employees.find({ hotel_id: 1 });

// Stock items at or below their reorder level (needs restocking)
db.stock_items.find({ $expr: { $lte: ["$quantity_in_stock", "$reorder_level"] } });

// Total bookings and revenue per hotel, highest revenue first
db.bookings.aggregate([
  { $group: { _id: "$hotel_id", total_bookings: { $sum: 1 }, total_revenue: { $sum: "$total_cost" } } },
  { $sort: { total_revenue: -1 } }
]);

// ------------------------- EMPLOYEE QUERIES --------------------------

// Pub orders taken by a given employee (line items are embedded)
db.pub_orders.find({ employee_id: 1 });

// Bookings checking in today (operational view)
db.bookings.find({ check_in_date: ISODate("2026-04-15T00:00:00Z") });

// ------------------------- CUSTOMER QUERIES --------------------------

// A guest viewing their own bookings
db.bookings.find({ guest_id: 1 });

// A guest viewing their own pub orders
db.pub_orders.find({ guest_id: 1 });

// Browse the menu by category
db.menu_items.find({ category: "Drink" });
