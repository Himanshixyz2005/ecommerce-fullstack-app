<div align="center">

# 🛍️ Full-Stack E-Commerce Mobile App

**A modern, premium e-commerce mobile experience built with React Native, Expo, Node.js, Express and MongoDB.**

![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-57-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## ✨ Overview

A full-stack e-commerce mobile application built for a **24-hour application development challenge**.

The project focuses on a smooth shopping journey from authentication to product discovery, cart management, checkout, and order history — all wrapped in a clean, premium visual language.

**Core flow**

```
Splash → Login / Signup → Home → Shop (Search / Filter / Sort)
   → Product Details → Add to Cart → Cart → Checkout
   → Order Placement → Profile (Order History)
```

---

## 🚀 Highlights

### 🔐 Authentication
- User registration & JWT-based login
- Persistent auth via AsyncStorage
- Forgot password / reset password flow
- Logout & protected backend routes

### 🛍️ Product Discovery
- Premium home screen — hero banner, categories, featured & trending products, special offers
- Search, category filtering, and sorting
- Responsive product grid
- Product detail view with image gallery and related products

### 🛒 Cart
- Add / remove products, increase or decrease quantity
- Automatic subtotal calculation & free shipping summary
- Backend-persisted cart, seamless checkout navigation

### 📦 Checkout & Orders
- Shipping address form with order validation
- Stock-aware order processing
- Automatic cart clearing after a successful order
- Full order history with status display

### 👤 Profile
- User info, order history, order totals & status
- Logout

### 🎨 UX & Engineering
- Premium purple design system with responsive layouts
- Loading & empty states, robust error handling
- Axios-based API integration with a JWT token interceptor
- MongoDB data persistence throughout

---

## 🧰 Tech Stack

**Frontend**

| Technology | Purpose |
|---|---|
| React Native | Mobile UI |
| Expo | Development/runtime |
| React Navigation | Stack + bottom-tab navigation |
| Axios | REST API communication |
| AsyncStorage | Authentication persistence |
| NativeWind / StyleSheet | UI styling |
| Expo Vector Icons | Interface icons |

**Backend**

| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin API access |
| dotenv | Environment configuration |
| Nodemon | Development server |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────┐
│              React Native / Expo               │
│                                                 │
│  Screens → Navigation → AuthContext → Axios    │
└──────────────────────┬──────────────────────────┘
                        │ REST API
                        │ JWT Bearer Token
                        ▼
┌───────────────────────────────────────────────┐
│             Node.js + Express API               │
│                                                 │
│  Routes → Middleware → Controllers → Models    │
└──────────────────────┬──────────────────────────┘
                        │ Mongoose
                        ▼
┌───────────────────────────────────────────────┐
│                    MongoDB                       │
│                                                 │
│  Users • Products • Carts • Orders             │
└───────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ecommerce-fullstack-app/
│
├── ecommerce-app/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── navigation/
│   │   │   └── AppNavigator.js
│   │   ├── screens/
│   │   │   ├── SplashScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   ├── SignupScreen.js
│   │   │   ├── ForgotPasswordScreen.js
│   │   │   ├── ResetPasswordScreen.js
│   │   │   ├── HomeScreen.js
│   │   │   ├── ProductListingScreen.js
│   │   │   ├── ProductDetailScreen.js
│   │   │   ├── CartScreen.js
│   │   │   ├── CheckoutScreen.js
│   │   │   └── ProfileScreen.js
│   │   └── services/
│   │       └── api.js
│   ├── App.js
│   ├── app.json
│   └── package.json
│
├── ecommerce-backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   └── productController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   └── orderRoutes.js
│   │   └── server.js
│   ├── seeder.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB running locally, or a MongoDB Atlas connection
- Expo-compatible environment
- Expo Go app for physical-device testing (optional)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Himanshixyz2005/ecommerce-fullstack-app.git
cd ecommerce-fullstack-app
```

### 2️⃣ Backend setup

```bash
cd ecommerce-backend
npm install
```

Create a `.env` file inside `ecommerce-backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

Start the backend:

```bash
npm run dev     # development
npm start       # production-style start
```

The API runs at `http://localhost:5000`.

### 3️⃣ Seed sample products

From `ecommerce-backend/`:

```bash
node seeder.js
```

This loads sample products across categories such as **Electronics**, **Fashion**, and **Beauty**.

### 4️⃣ Frontend setup

In a new terminal:

```bash
cd ecommerce-app
npm install
npm start          # start Expo
npm run web         # run in browser
npm run android      # run on Android
npm run ios          # run on iOS
```

> 💡 For a physical device, update the frontend API base URL from `localhost` to the local IP address of the machine running the backend.

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

**Authentication**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive JWT |
| POST | `/auth/forgot-password` | No | Generate password reset token |
| POST | `/auth/reset-password` | No | Reset password |

**Products**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | No | Fetch products |
| GET | `/products/:id` | No | Fetch product details |

**Cart**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cart` | JWT | Fetch current user's cart |
| POST | `/cart` | JWT | Add/update cart item |

**Orders**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/orders` | JWT | Fetch current user's orders |
| POST | `/orders` | JWT | Place a new order |

---

## 📸 Screenshots

<div align="center">

| 🏠 Home | 🛍️ Product Discovery | 📦 Product Details |
|---|---|---|
| <img src="./screenshots/home.png" width="220"/> | <img src="./screenshots/shop.png" width="220"/> | <img src="./screenshots/product-details.png" width="220"/> |

| 🛒 Cart | 💳 Checkout | 👤 Profile & Orders |
|---|---|---|
| <img src="./screenshots/cart.png" width="220"/> | <img src="./screenshots/checkout.png" width="220"/> | <img src="./screenshots/profile.png" width="220"/> |

</div>

---

## 🔐 Authentication Flow

```
Register / Login → JWT → AsyncStorage → Axios Interceptor
   → Authorization: Bearer <token> → Protected Express Routes
```

Authentication state is restored on app launch, so users stay logged in across sessions.

---

## 🛡️ Security

- Password hashing with bcryptjs
- JWT authentication on protected cart and order routes
- Authorization headers via Axios
- Environment-based MongoDB credentials & JWT secret
- Input validation on authentication and checkout flows

> ⚠️ Never commit your `.env` file or production credentials to GitHub.

---

## 📱 Application Screens

| Screen | Purpose |
|---|---|
| Splash | Brand introduction |
| Login | User authentication |
| Signup | Account creation |
| Forgot Password | Password recovery |
| Reset Password | New password creation |
| Home | Product discovery |
| Shop | Search, filtering, and sorting |
| Product Details | Product info and related products |
| Cart | Cart management |
| Checkout | Shipping and order placement |
| Profile | Account and order history |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Purple | `#7C3AED` |
| Background | `#F4F3FF` |
| Card | `#FFFFFF` |
| Primary Text | `#111827` |
| Secondary Text | `#64748B` |
| Border | `#E2E8F0` |
| Success | `#16A34A` |
| Error | `#DC2626` |

**Design principles:** clear visual hierarchy · rounded cards · spacious layouts · strong primary CTAs · consistent typography · responsive product grids · minimal visual clutter · accessible contrast and readable text

---

## 🧪 Recommended Test Flow

1. Create account → Login → Refresh app → Confirm auth persists
2. Browse Home → Open Shop → Search for a product
3. Apply category filter/sort → Open Product Details
4. Add product to Cart → Update quantity → Remove/re-add product
5. Proceed to Checkout → Enter shipping details → Place Order
6. Open Profile → Verify Order History → Logout

---

## 📌 Assignment Coverage

<details>
<summary><strong>Click to expand full checklist</strong></summary>

| Requirement | Status |
|---|---|
| React Native | ✅ |
| Expo | ✅ |
| React Navigation | ✅ |
| Axios | ✅ |
| AsyncStorage | ✅ |
| Node.js | ✅ |
| Express.js | ✅ |
| MongoDB | ✅ |
| JWT Authentication | ✅ |
| Splash Screen | ✅ |
| Login | ✅ |
| Signup | ✅ |
| Forgot Password | ✅ |
| Reset Password | ✅ |
| Home Screen | ✅ |
| Hero Banner | ✅ |
| Categories | ✅ |
| Featured Products | ✅ |
| Trending Products | ✅ |
| Special Offers | ✅ |
| Product Listing | ✅ |
| Search | ✅ |
| Filtering | ✅ |
| Sorting | ✅ |
| Product Details | ✅ |
| Product Image Gallery | ✅ |
| Related Products | ✅ |
| Cart | ✅ |
| Quantity Management | ✅ |
| Remove Product | ✅ |
| Checkout | ✅ |
| Shipping Address | ✅ |
| Order Placement | ✅ |
| Profile | ✅ |
| Order History | ✅ |
| Logout | ✅ |
| Loading States | ✅ |
| Error Handling | ✅ |
| Responsive UI | ✅ |

</details>

---

## 🚧 Future Enhancements

- ❤️ Wishlist
- 🌙 Dark mode
- 💳 Payment gateway integration
- 🔔 Push notifications
- ⭐ Product reviews
- 🧑‍💼 Admin dashboard
- 📊 Sales analytics
- 📦 Advanced order tracking
- 🧾 Invoice generation

*These are intentionally outside the core implementation scope of the 24-hour challenge.*

---

## 💡 Engineering Decisions

**Why React Native + Expo?**
Expo provides a fast development workflow, while React Native lets the same architecture target mobile and web during development.

**Why Express?**
Express keeps the REST API lightweight and easy to structure into routes, controllers, and middleware.

**Why MongoDB?**
The document model maps naturally to products, carts, users, and orders, allowing rapid iteration under a time-constrained assignment.

**Why JWT + AsyncStorage?**
JWT provides stateless API authentication, while AsyncStorage persists the authenticated session between app launches.

---

## 📈 What This Project Demonstrates

Full-stack application architecture · React Native mobile development · REST API design · Authentication & authorization · MongoDB data modeling · Axios API integration · State management with React Context · Persistent client-side sessions · Cart & checkout workflows · Order management · Responsive UI/UX · Error & loading-state handling · Frontend/backend integration

---

## 👩‍💻 Author

**Himanshi Goyal**
Computer Science & Engineering · Full-Stack • AI/ML • Software Development

GitHub: [@Himanshixyz2005](https://github.com/Himanshixyz2005)

---

<div align="center">

⭐ **If you found this project interesting**, feel free to explore the repository, review the architecture, and try the application locally.

Built with ❤️ using React Native, Expo, Node.js, Express & MongoDB

</div>