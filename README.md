# EvenTo Backend

EvenTo is a backend API designed for e-commerce platforms, offering features such as wishlist management, cart operations, order processing, user disputes, banner handling, and much more. This project is built with Node.js, Express, and MongoDB, focusing on scalability, security, and performance.

---

## Table of Contents

- [Features](#features)
  - [Wishlist](#wishlist)
  - [Cart](#cart)
  - [Orders](#orders)
  - [Disputes](#disputes)
  - [Banners](#banners)
  - [Testimonials](#testimonials)
  - [About Us](#about-us)
  - [Social Media Links](#social-media-links)
  - [Notifications](#notifications)
  - [Delivery](#delivery)
  - [Influencers](#influencers)
  - [Coupons](#coupons)
  - [File Downloads](#file-downloads)
- [Technologies Used](#technologies-used)
- [Packages](#packages)
- [Installation](#installation)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Wishlist
- **Add Product to Wishlist**: Allows users to add a product to their wishlist.
- **Remove Product from Wishlist**: Remove a specific product.
- **Get User Wishlist**: Retrieve all products in a user's wishlist.
- **Delete Entire Wishlist**: Clear the user's wishlist.

### Cart
- **Add Product to Cart**: Add a product to the shopping cart.
- **Add Product Info**: Add extra details (e.g., images) to cart items.
- **Add Notes**: Attach a note to a cart item.
- **Modify Cart Item**: Increment or decrement the quantity of a cart item.
- **Delete Product**: Remove a specific product from the cart.
- **Clear Cart**: Delete all items from the user's cart.
- **View Cart**: Retrieve all cart items.
- **Find Product by Random Number**: Retrieve product details using a unique identifier.

### Orders
- **Create Order**: Allows users to place an order.
- **View Order by ID**: Fetch details of a specific order.
- **View All User Orders**: Retrieve the order history for a user.
- **Advanced Search**: Search orders with filters.
- **Change Order Status**: Update the status of an order (e.g., processing, shipped, completed).
- **Admin Insights**:
  - Best-selling products.
  - Total quantity sold.
  - Sales by product category.

### Disputes
- **Add Dispute**: Submit a user complaint or issue.
- **View Dispute**: Fetch a specific dispute by ID.
- **Search Disputes**: Search for disputes by keyword.
- **Change Dispute Status**: Update the resolution status of a dispute.
- **Admin Control**:
  - View all disputes.
  - Delete disputes.

### Banners
- **Add Banner**: Create new promotional banners.
- **Get Banners**: Retrieve all active banners.
- **Delete Banner**: Remove a specific banner.

### Testimonials
- **Add Testimonial**: Submit a new testimonial for the platform.
- **View Testimonials**: Retrieve all user testimonials.
- **Delete Testimonial**: Admin removal of testimonials.

### About Us
- **Add About Us Section**: Admin can add company information.
- **Update About Us Section**: Modify existing entries.
- **Delete About Us Section**: Remove outdated content.
- **Get About Us Information**: Retrieve all company information.

### Social Media Links
- **Add Social Media Links**: Admin can add social media links.
- **Update Social Media Links**: Modify existing links.
- **Delete Social Media Links**: Remove old or broken links.
- **View Social Media Links**: Retrieve all links for users.

### Notifications
- **Add Notification**: Admin can add notifications for users.
- **View Notifications**: Retrieve all active notifications.
- **Delete Notification**: Admin removal of notifications.

### Delivery
- **Add Delivery Cost**: Add pricing details for delivery services.
- **View Delivery Costs**: Retrieve all delivery price entries.
- **Update Delivery Cost**: Modify delivery cost entries.
- **Delete Delivery Cost**: Remove outdated delivery price entries.

### Influencers
- **Add Influencer**: Admin can register influencers for campaigns.
- **Update Influencer Details**: Modify influencer profiles.
- **Delete Influencer**: Remove influencers.
- **View Influencer by ID**: Retrieve details of a specific influencer.
- **Get All Influencers**: Retrieve a list of influencers sorted by ratings.
- **Add Rating**: Users can rate influencers.

### Coupons
- **Add Coupon**: Admin can create new coupons.
- **Update Coupon**: Modify existing coupon details.
- **View Coupon by ID**: Fetch details of a specific coupon.
- **Search Coupon by Name**: Retrieve coupons by name.
- **Activate/Deactivate Coupons**: Toggle coupon status.
- **Influencer Coupons**:
  - Retrieve influencer-specific coupons.
  - Delete influencer-related coupons.
  - Search influencer coupons by name.

### File Downloads
- **Download Files**: Provides an endpoint for downloading specific files.

---

## Technologies Used

| Technology    | Description                       |
|---------------|-----------------------------------|
| **Node.js**   | JavaScript runtime for backend development. |
| **Express.js**| Web framework for creating APIs. |
| **MongoDB**   | NoSQL database for data storage. |
| **Multer**    | Middleware for file uploads.     |
| **JWT**       | Authentication using JSON Web Tokens. |
| **Nodemailer**| Sending emails from the server.  |
| **Node-cron** | Scheduling periodic tasks.       |

---

## Packages

| Package                 | Version   | Purpose                                  |
|-------------------------|-----------|------------------------------------------|
| **bcryptjs**            | ^2.4.3    | Password hashing.                        |
| **body-parser**         | ^1.20.2   | Parse incoming request bodies.           |
| **cors**                | ^2.8.5    | Enable Cross-Origin Resource Sharing.    |
| **dotenv**              | ^16.0.3   | Environment variable management.         |
| **express**             | ^4.17.1   | Web framework.                           |
| **express-rate-limit**  | ^7.1.5    | Rate-limiting middleware.                |
| **helmet**              | ^7.1.0    | Secure HTTP headers.                     |
| **joi**                 | ^17.12.1  | Schema validation.                       |
| **jsonwebtoken**        | ^9.0.0    | Token-based authentication.              |
| **mongoose**            | ^7.0.2    | MongoDB object modeling.                 |
| **multer**              | ^1.4.2    | File upload middleware.                  |
| **node-cron**           | ^3.0.3    | Scheduling tasks.                        |
| **nodemailer**          | ^6.9.1    | Email management.                        |
| **uuid**                | ^9.0.0    | Unique identifier generation.            |
| **validator**           | ^13.9.0   | Data validation utilities.               |

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
