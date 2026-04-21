# Products API 



# Backend

## Folder Structure

```
backend/
├── src/
│   ├── config/       # Database configuration
│   ├── controllers/  # Request handlers
│   ├── middlewares/  # Express middlewares (Auth, etc.)
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── app.js        # App entry point
├── .env              # Environment variables
└── package.json      # Dependencies and scripts
```

## Setup Instructions

1. **Install Dependencies**

    ```bash
    cd backend
    npm install
    ```

2. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory (already created):

    ```env
    PORT=8080
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development
    ```

3. **Run the Server**
    - Development mode: `npm run dev`
    - Production mode: `npm start`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user (Name, Email, Password)
- `POST /api/auth/login` - Login (Email, Password)

### Products

##### All routes are protected and requires login

- `GET /api/products` - Get all products
- `GET /api/products/featured` - Fetch featured products
- `GET /api/products/price-less-than/:price` - Fetch products with price less than `:price`
- `GET /api/products/rating-higher-than/:rating` - Fetch products with rating higher than `:rating`
- `POST /api/products` - Add a product
- `PUT /api/products/:id` - Update a product by Product ID
- `DELETE /api/products/:id` - Delete a product by Product ID



## Product Schema

- **productId**: String (Unique, Required)
- **name**: String (Required)
- **price**: Number (Required)
- **featured**: Boolean (Default: false)
- **rating**: Decimal128 (Default: 0.0)
- **company**: String (Required)
- **createdAt**: Date (Automatic/Required)

<br/>

# Frontend

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS & shadcn/ui
- **State Management**: React Context API (for Auth)
- **Icons**: Lucide React

## Folder Structure
```
frontend/
├── src/
│   ├── app/         # Pages and layout (App Router)
│   ├── components/  # Reusable UI components (shadcn)
│   ├── context/     # Auth and State management
│   ├── lib/         # API helpers and utilities
│   └── hooks/       # Custom React hooks
├── .env             # API URL configuration
└── package.json     # Scripts and dependencies
```

## Setup Instructions

1. **Install Dependencies**
    ```bash
    cd frontend
    npm install
    ```

2. **Configure Environment Variables**
   Create a `.env` file in the `frontend` directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ```

3. **Run the Application**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

## Key Features
- **Authentication**: JWT-based Signup and Login.
- **Dashboard**: Protected route to view and manage products.
- **CRUD Operations**: Add, Edit, and Delete products.
- **Filtering**: Search and filter products by price, rating, or status.

