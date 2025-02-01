## Project Overview

This is a **Node.js-based e-commerce platform** for selling furniture using **VR technologies**. The platform is connected to the **Ethereum network** via the **Truffle Framework** to document sales operations. It includes various features such as:

- **User Authentication**: Secure login and registration system.
- **Product Management**: Add, update, and manage furniture products.
- **Order Processing**: Handle customer orders efficiently.
- **Payment Integration**: Seamless payment processing.
- **Recommendation Systems**: Personalized product recommendations for users.

## 🛠️ Technologies Used

### Backend
- **Node.js**: Runtime environment for building scalable server-side applications.
- **Express.js**: Web framework for building RESTful APIs.

### Database
- **MongoDB**: NoSQL database for storing unstructured data.

### Authentication
- **JWT**: JSON Web Tokens for secure user authentication.
  
### Payments
- **PayPal SDK**: Integration for processing payments.

### Machine Learning
- **TensorFlow.js**: Machine learning library for building recommendation systems.
- **Brain.js**: JavaScript library for neural networks.
- **Surprise.js**: Library for building and analyzing recommender systems.

### Blockchain
- **Web3.js**: Library for interacting with the Ethereum blockchain.

### Notifications
- **Firebase Cloud Messaging (FCM)**: Push notification service for real-time updates.

### File Handling
- **Multer**: Middleware for handling file uploads.

### Logging & Utilities
- **Winston**: Logging library for application logs.
- **dotenv**: Environment variable management.
- **moment**: Library for date and time manipulation.

## 🚀 Features

- **User Authentication**: Secure login and registration system.
- **Product Management**: Add, update, and manage furniture products.
- **Order Processing**: Handle customer orders efficiently.
- **Payment Integration**: Seamless payment processing.
- **Recommendation Systems**: Personalized product recommendations for users.
- **Blockchain Integration**: Document sales operations on the Ethereum network.
- **VR Integration**: Immersive shopping experience using VR technologies.

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ghusn-Mhsen/E-commerce-back
   ```
 2. **Install dependencies:**:
   ```bash
   npm install
   ```

3. **Set up environment variables:**:
   
  Create a .env file in the root directory and add     necessary configurations (MongoDB URI, API keys, JWT  secrets, etc.)
 
4. **Start the application:**:
   ```bash
   npm Start
   ```  
   or using Nodemon for development:
   ```bash
   npm run dev
   ```

## 🌐 API Routes

### User Authentication
- **POST** `/auth/register` - Register a new user.
- **POST** `/auth/login` - User login.
- **POST** `/auth/google` - Google OAuth login.
- **GET** `/auth/logout` - Logout user.

### Orders
- **POST** `/user/Customer/addOrder` - Add a new order.
- **GET** `/user/allUsers/getOrderById/:id` - Get order by ID.
- **GET** `/user/allUsers/getUserOrders` - Get user orders.
- **PUT** `/user/allUsers/ChangeOrderStatus` - Change order status.

### Order Statistics
- **GET** `/user/Admin/getTotalRevenue` - Get total revenue.
- **GET** `/user/Admin/getTotalQuantitySold` - Get total quantity sold.
- **GET** `/user/Admin/getAverageOrderValue` - Get average order value.

### Payment (PayPal)
- **GET** `/user/Customer/pay` - Create PayPal payment.
- **GET** `/user/Customer/paypal/success` - Payment success callback.
- **GET** `/user/Customer/paypal/Cancel` - Payment cancellation.

### Device Tokens (FCM Notifications)
- **POST** `/user/allUsers/addDeviceTokens` - Add device token.
- **GET** `/user/allUsers/getDeviceTokenByID/:id` - Get device token by ID.
- **DELETE** `/user/Admin/deleteDeviceToken/:id` - Delete device token.

### Products
- **GET** `/user/allUsers/Product/:id` - Get product by ID.
- **GET** `/user/allUsers/getProduct/:id` - Get product details.
- **GET** `/user/allUsers/CategorieProducts/:cate` - Get products by category.

### Offers
- **POST** `/user/Merchant/addOffer` - Create offer.
- **GET** `/user/allUsers/getOffers` - Get active offers.

### Hot Selling Products
- **POST** `/user/Merchant/addToHotSelling/:id` - Add product to hot selling.
- **GET** `/user/allUsers/getHotSelling` - Get hot selling products.

### Categories
- **POST** `/user/Merchant/addingCategorie` - Add new category.
- **GET** `/user/allUsers/getCategorie` - Get all categories.
- **DELETE** `/user/Merchant/deleteCategorie/:id` - Delete category.

### Banners
- **POST** `/user/Admin/addToBanner` - Add new banner.
- **GET** `/user/allUser/getBanners` - Get banners.
- **DELETE** `/user/Admin/deleteFromBanner/:id` - Delete banner.

### Recommendations
- **GET** `/user/allUsers/recommendations` - Get recommended products (non-ML).
- **GET** `/user/allUsers/recommendationsMl` - Get recommended products (ML-based).

### Loyalty Points & Blockchain Integration
- **GET** `/user/allUsers/getMyBalance` - Get user loyalty points.
- **GET** `/user/allUsers/getUserProductsHistory/:id` - Get product transaction history.
- **GET** `/user/allUsers/getUserPointsHistory` - Get user points transaction history.

   

