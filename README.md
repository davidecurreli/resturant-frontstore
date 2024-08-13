# H-Ey Demo Restaurant Application

Welcome to the H-Ey Demo Restaurant Application! This React-based web application simulates a restaurant's online ordering system with user authentication, menu display, cart functionality, and order history.

## Features

### 1. User Authentication
- Users can log in with their first name, last name, email, and phone number.
- User information is stored locally for persistent sessions.
- Logged-in users can access additional features like submitting orders and viewing order history.

### 2. Interactive Menu
- Displays a grid of menu items.
- Each menu item shows:
  - Item name
  - Description
  - Price
  - Category
- Animated entry of menu items for a smooth user experience.

### 3. Shopping Cart
- Users can add items to their cart directly from the menu.
- The cart displays:
  - Item names
  - Quantities
  - Individual item totals
  - Overall cart total
- Users can adjust item quantities or remove items from the cart.
- The cart persists across sessions using local storage.

### 4. Order Submission
- Logged-in users can submit their orders.
- Orders are sent to a backend API for processing.
- Upon successful submission, users receive an order confirmation.

### 5. Order History
- Logged-in users can view their order history.
- Displays past orders with details like order ID, date, total amount, and status.
- Users can view detailed information for each past order.

### 6. Responsive Design
- The application is designed to work seamlessly on both desktop and mobile devices.
- Responsive layout adjusts to different screen sizes for optimal viewing.

### 7. About Us Page
- Provides information about the made up restaurant's story and mission.
- Showcases key team members with their roles and images.

## Technical Highlights

- Built with React for a dynamic and efficient user interface.
- Uses React Router for navigation between different sections of the app.
- Implements context API for global state management (user authentication).
- Utilizes local storage for persisting cart and user session data.
- Integrates with a backend API for menu retrieval and order submission.
- Implements CSS animations for enhanced user experience.
- Modular component structure for maintainability and reusability.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
