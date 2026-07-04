[README.md](https://github.com/user-attachments/files/29660605/README.md)
# 🍺 Hotel & Pub Management — MongoDB (NoSQL)

A **NoSQL / document-database** redesign of a multi-site hotel-and-pub business in **MongoDB**, built around how the data is actually read. Covers hotels, rooms, guests, bookings, employees, menu, pub orders, and stock across seven collections — with role-based queries for managers, employees, and customers.

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![NoSQL](https://img.shields.io/badge/NoSQL-document%20model-13AA52?style=flat-square)

> MSc *Database Systems* — Assignment 2 (NoSQL), University of Dundee. Group project. Companion to the relational version: **[hotel-database-sql](https://github.com/momo717-code/hotel-database-sql)**.

---

## Why NoSQL here

The business reads data in whole "documents" — an order with all its items, a hotel with all its rooms — so a document model fits better than spreading every read across joins. The schema is designed around three deliberate decisions:

- **Embed the `items` array inside `pub_orders`** — an order and its line items are always read and written together, so they live in one document.
- **Embed the `rooms` array inside `hotels`** — rooms belong to exactly one hotel and are always viewed in that context.
- **Reference across collections** (`guest_id`, `hotel_id`, `employee_id`) where entities are large or shared, to avoid duplication.

## Collections (`/data`)

`hotels` · `rooms`* · `guests` · `bookings` · `employees` · `menu_items` · `pub_orders` · `stock_items`
<sub>*rooms are also embedded within hotel documents.</sub>

## Role-based access

Queries are organised by user role (see **`queries.js`**):

- **Managers** — full analytics: bookings by status/hotel, staff lists, low-stock alerts, revenue aggregation.
- **Employees** — operational reads: their own orders, stock levels.
- **Customers** — self-service: their own bookings and the menu.

Example — low-stock alert using `$expr`:

```js
db.stock_items.find({ $expr: { $lte: ["$quantity_in_stock", "$reorder_level"] } })
```

Example — revenue per hotel using the aggregation pipeline:

```js
db.bookings.aggregate([
  { $group: { _id: "$hotel_id", total_bookings: { $sum: 1 }, total_revenue: { $sum: "$total_cost" } } },
  { $sort: { total_revenue: -1 } }
])
```

## Import & run

```bash
# import each collection (repeat per file in /data)
mongoimport --db hotel_pub_management --collection bookings --jsonArray --file data/bookings.json
# ...then open mongosh and run the statements in queries.js
```

## Notes

- The written design report is included as **`NoSQL_Design_Report.pdf`** — the MongoDB Atlas connection string and student IDs have been **redacted**. Import the JSON locally instead.
- All data is fictional/illustrative.

## What I learned

- **Document modelling** — deciding when to embed vs. reference based on access patterns.
- The **aggregation pipeline** (`$group`, `$sort`, `$expr`, `$lte`) for analytics.
- Designing **role-appropriate queries** for different users of the same data.
