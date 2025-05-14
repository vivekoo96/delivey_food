# Food App Documentation

## Overview
The Food App is a comprehensive platform designed to manage various aspects of a food delivery business. It includes features for managing products, orders, categories, branches, and more. The app is built with a React frontend and a Node.js backend, using MySQL as the database.

## Features

### Frontend
- **Dashboard**: Provides an overview of key metrics and activities.
- **Products Management**: Add, edit, and manage products, including attributes and tax settings.
- **Orders**: View and manage customer orders.
- **Support Tickets**: Manage customer support tickets and ticket types.
- **Media Management**: Upload and manage media files.
- **POS**: A point-of-sale system for in-store transactions.
- **Sliders and Offers**: Manage promotional sliders and offers.

### Backend
- **Authentication**: Secure login and user management.
- **Database**: MySQL database for storing all application data.
- **API Endpoints**: RESTful APIs for frontend-backend communication.
- **Middleware**: Authentication and validation middleware for secure and reliable operations.

## Installation

### Prerequisites
- Node.js
- MySQL
- npm or yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/food-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd food-app
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   cd my-app && npm install
   cd ../food-api && npm install
   ```
4. Set up the MySQL database:
   - Create a database named `food_app`.
   - Import the provided SQL file (if available).
   - Update the `config/database.js` file with your MySQL credentials.
5. Start the backend server:
   ```bash
   cd food-api
   npm start
   ```
6. Start the frontend development server:
   ```bash
   cd my-app
   npm run dev
   ```

## Folder Structure

### Backend (`food-api`)
- **config/**: Configuration files (e.g., database connection).
- **controllers/**: Business logic for handling API requests.
- **models/**: Database models for MySQL.
- **routes/**: API route definitions.
- **services/**: Utility services (e.g., bulk upload).
- **uploads/**: Directory for uploaded files.

### Frontend (`my-app`)
- **src/**: Source code for the React application.
  - **components/**: Reusable UI components.
  - **pages/**: Page-level components for different routes.
  - **layout/**: Layout components like the sidebar and header.
  - **utils/**: Utility functions.

## API Endpoints

### Products
- `GET /api/products`: Fetch all products.
- `POST /api/products`: Add a new product.
- `PUT /api/products/:id`: Update a product.
- `DELETE /api/products/:id`: Delete a product.

### Support Tickets
- `GET /api/ticket-types`: Fetch all ticket types.
- `POST /api/ticket-types`: Add a new ticket type.
- `GET /api/tickets`: Fetch all tickets.
- `POST /api/tickets`: Add a new ticket.

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.
