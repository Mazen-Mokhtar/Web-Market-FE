# Website Marketplace API

A comprehensive marketplace platform for buying and selling websites built with NestJS.

## Features

- **Website Listings**: Browse and search available websites
- **User Authentication**: Secure user registration and login
- **Role-based Access**: Admin, seller, and buyer roles
- **Payment Integration**: Multiple payment methods support
- **Image Upload**: Cloud storage for website images
- **Sales Management**: Complete sales workflow
- **Dashboard**: Analytics and management tools

## Website Types

- E-commerce websites
- Blog websites
- Portfolio websites
- Corporate websites
- Landing pages
- Dashboard applications
- Other custom websites

## Technology Stack

- **Backend**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Payment**: Stripe integration
- **Email**: Nodemailer

## Project Setup

```bash
$ npm install
```

## Environment Variables

Create a `.env` file with the following variables:

```env
DB_URL=mongodb://localhost:27017/website-marketplace
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STRIPE_SECRET_KEY=your-stripe-secret
EMAIL_HOST=your-email-host
EMAIL_USER=your-email-user
EMAIL_PASS=your-email-password
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Websites
- `GET /websites` - Get all websites
- `GET /websites/available` - Get available websites
- `GET /websites/:id` - Get website by ID
- `GET /websites/slug/:slug` - Get website by slug
- `POST /websites` - Create new website (seller/admin only)
- `PATCH /websites/:id` - Update website (owner only)
- `DELETE /websites/:id` - Delete website (owner only)
- `POST /websites/:id/buy` - Buy website

### Sales
- `GET /sales` - Get all sales (admin only)
- `GET /sales/my-purchases` - Get user's purchases
- `GET /sales/my-sales` - Get user's sales
- `POST /sales` - Create new sale
- `GET /sales/:id` - Get sale by ID
- `POST /sales/:id/complete` - Mark sale as completed
- `POST /sales/:id/deliver` - Mark sale as delivered

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin only)
- `PATCH /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)

### Users
- `GET /users/profile` - Get user profile
- `PATCH /users/profile` - Update user profile
- `GET /users` - Get all users (admin only)

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This project is [MIT licensed](LICENSE).
