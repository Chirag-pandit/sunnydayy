# E-commerce Store with Razorpay Integration

A modern e-commerce application with Razorpay payment gateway integration and admin panel for order management.

## Features

- 🛒 Shopping cart functionality
- 💳 Online payments via Razorpay
- 💰 Cash on Delivery (COD) option
- 📦 Order management system
- 👨‍💼 Admin dashboard
- 📱 Responsive design

## Prerequisites

- Node.js 14.x or later
- MongoDB Atlas account or local MongoDB instance
- Razorpay account (for payment processing)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sunnydayy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Razorpay API keys and MongoDB connection string

4. **Set up Razorpay**
   - Sign up at [Razorpay](https://razorpay.com/)
   - Get your API keys from the Razorpay Dashboard
   - Add the webhook URL in Razorpay Dashboard: `https://yourdomain.com/api/webhooks/razorpay`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=your_database_name
```

## Project Structure

```
sunnydayy/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Next.js pages
│   │   ├── api/          # API routes
│   │   └── admin/        # Admin panel pages
│   └── utils/            # Utility functions
├── public/               # Static files
└── styles/               # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
