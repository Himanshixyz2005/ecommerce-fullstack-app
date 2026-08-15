# 🛍️ E-Commerce Mobile App

A modern full-stack e-commerce mobile application built within
a 24-hour development challenge using React Native, Expo,
Node.js, Express and MongoDB.

## ✨ Features

### Authentication
- User registration
- Login with JWT authentication
- Persistent authentication
- Forgot password
- Reset password
- Logout

### Shopping
- Hero banner
- Product categories
- Featured products
- Trending products
- Product search
- Product filtering
- Product details
- Related products

### Cart
- Add products
- Update quantity
- Remove products
- Automatic total calculation

### Checkout
- Shipping address
- Order summary
- Payment selection
- Order placement
- Validation
- Loading and error states

### Profile
- User information
- Order history
- Order status
- Logout

## 🛠️ Tech Stack

### Frontend
- React Native
- Expo
- React Navigation
- Axios
- AsyncStorage
- NativeWind / StyleSheet

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## 📁 Project Structure

ecommerce-app/
├── src/
│   ├── components/
│   ├── context/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── hooks/
│   └── utils/
├── assets/
├── App.js
├── app.json
└── package.json

## 🚀 Installation

### Frontend

```bash
npm install
npx expo start

Backend
npm install
npm run dev
🔐 Environment Variables

Create a .env file and configure:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
📱 Application Flow

Signup → Login → Home → Products → Product Details
→ Cart → Checkout → Order → Profile → Order History
