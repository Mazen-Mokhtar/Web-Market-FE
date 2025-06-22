# Website Marketplace API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout User
```http
POST /auth/logout
Authorization: Bearer <token>
```

### Websites

#### Get All Websites
```http
GET /websites
```

#### Get Available Websites
```http
GET /websites/available
```

#### Get Website by ID
```http
GET /websites/:id
```

#### Get Website by Slug
```http
GET /websites/slug/:slug
```

#### Create Website (Seller/Admin only)
```http
POST /websites
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "E-commerce Store",
  "description": "A modern e-commerce website",
  "demoUrl": "https://demo.example.com",
  "sourceCodeUrl": "https://github.com/example/repo",
  "price": 500,
  "type": "ecommerce",
  "technologies": ["React", "Node.js", "MongoDB"],
  "features": ["User authentication", "Payment integration"],
  "pagesCount": 15,
  "isResponsive": true,
  "hasAdminPanel": true,
  "hasDatabase": true,
  "categoryId": "category-id",
  "folderId": "folder-id",
  "images": [file1, file2, ...]
}
```

#### Update Website (Owner only)
```http
PATCH /websites/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Website Name",
  "price": 600
}
```

#### Delete Website (Owner only)
```http
DELETE /websites/:id
Authorization: Bearer <token>
```

#### Buy Website
```http
POST /websites/:id/buy
Authorization: Bearer <token>
```

### Sales

#### Get All Sales (Admin only)
```http
GET /sales
Authorization: Bearer <token>
```

#### Get My Purchases
```http
GET /sales/my-purchases
Authorization: Bearer <token>
```

#### Get My Sales
```http
GET /sales/my-sales
Authorization: Bearer <token>
```

#### Create Sale
```http
POST /sales
Authorization: Bearer <token>
Content-Type: application/json

{
  "websiteId": "website-id",
  "amount": 500,
  "discountAmount": 50,
  "paymentMethod": "card",
  "notes": "Additional notes",
  "deliveryMethod": "email",
  "deliveryDetails": "Send to john@example.com"
}
```

#### Get Sale by ID
```http
GET /sales/:id
Authorization: Bearer <token>
```

#### Get Sale by Sale ID
```http
GET /sales/sale-id/:saleId
Authorization: Bearer <token>
```

#### Mark Sale as Completed (Admin only)
```http
POST /sales/:id/complete
Authorization: Bearer <token>
```

#### Mark Sale as Delivered
```http
POST /sales/:id/deliver
Authorization: Bearer <token>
```

#### Confirm Delivery
```http
POST /sales/:id/confirm-delivery
Authorization: Bearer <token>
Content-Type: application/json

{
  "isBuyer": true
}
```

#### Process Refund (Admin only)
```http
POST /sales/:id/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "refundAmount": 500,
  "refundReason": "Customer request"
}
```

### Categories

#### Get All Categories
```http
GET /categories
```

#### Create Category (Admin only)
```http
POST /categories
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "E-commerce",
  "logo": file
}
```

#### Update Category (Admin only)
```http
PATCH /categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Category Name"
}
```

#### Delete Category (Admin only)
```http
DELETE /categories/:id
Authorization: Bearer <token>
```

### Users

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PATCH /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Get All Users (Admin only)
```http
GET /users
Authorization: Bearer <token>
```

## Data Models

### Website
```typescript
{
  _id: string;
  name: string;
  slug: string;
  description: string;
  demoUrl: string;
  sourceCodeUrl?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  type: 'ecommerce' | 'blog' | 'portfolio' | 'corporate' | 'landing' | 'dashboard' | 'other';
  status: 'available' | 'sold' | 'reserved';
  technologies?: string[];
  features?: string[];
  pagesCount?: number;
  isResponsive: boolean;
  hasAdminPanel: boolean;
  hasDatabase: boolean;
  hostingInfo?: string;
  domainInfo?: string;
  mainImage: { secure_url: string; public_id: string };
  gallery: Array<{ secure_url: string; public_id: string }>;
  createdBy: string;
  categoryId: string;
  folderId: string;
  likes: string[];
  viewsCount: number;
  soldAt?: Date;
  soldTo?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Sale
```typescript
{
  _id: string;
  saleId: string;
  websiteId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  discountAmount?: number;
  finalAmount: number;
  paymentMethod: 'card' | 'bank_transfer' | 'paypal' | 'crypto';
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  transactionId?: string;
  paidAt?: Date;
  completedAt?: Date;
  notes?: string;
  refundReason?: string;
  refundedAt?: Date;
  refundAmount?: number;
  deliveryMethod?: string;
  deliveryDetails?: string;
  deliveredAt?: Date;
  isDelivered: boolean;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### User
```typescript
{
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'seller' | 'buyer';
  isEmailVerified: boolean;
  profileImage?: { secure_url: string; public_id: string };
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
{
  _id: string;
  name: string;
  slug: string;
  logo: { secure_url: string; public_id: string };
  createdBy: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Responses

All error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error 