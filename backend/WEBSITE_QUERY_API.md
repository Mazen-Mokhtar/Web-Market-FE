# Website Query API Documentation

## Overview
The website query API provides advanced filtering, searching, and pagination capabilities for retrieving websites.

## Base URL
```
GET /websites
```

## Query Parameters

### Search & Filtering
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in name, slug, description, technologies, and features | `?search=react` |
| `categoryId` | string | Filter by category ID | `?categoryId=507f1f77bcf86cd799439011` |
| `type` | enum | Filter by website type | `?type=ecommerce` |
| `status` | enum | Filter by website status | `?status=available` |
| `available` | boolean | Filter for available websites only | `?available=true` |
| `createdBy` | string | Filter by creator user ID | `?createdBy=507f1f77bcf86cd799439011` |

### Price Range
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `minPrice` | number | Minimum price filter | `?minPrice=100` |
| `maxPrice` | number | Maximum price filter | `?maxPrice=1000` |

### Features
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `isResponsive` | boolean | Filter responsive websites | `?isResponsive=true` |
| `hasAdminPanel` | boolean | Filter websites with admin panel | `?hasAdminPanel=true` |
| `hasDatabase` | boolean | Filter websites with database | `?hasDatabase=true` |

### Technologies & Features Arrays
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `technologies` | string[] | Filter by technologies (comma-separated) | `?technologies=react,nodejs` |
| `features` | string[] | Filter by features (comma-separated) | `?features=payment,blog` |

### Pagination & Sorting
| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `limit` | number | Number of results per page (1-100) | 10 | `?limit=20` |
| `page` | number | Page number (0-based) | 0 | `?page=1` |
| `sortBy` | string | Sort field | createdAt | `?sortBy=price` |
| `sortOrder` | string | Sort direction (asc/desc) | desc | `?sortOrder=asc` |

## Response Format

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "E-commerce Store",
    "slug": "ecommerce-store",
    "description": "Modern e-commerce website",
    "price": 299,
    "type": "ecommerce",
    "status": "available",
    "technologies": ["React", "Node.js"],
    "features": ["Payment", "Admin Panel"],
    "isResponsive": true,
    "hasAdminPanel": true,
    "hasDatabase": true,
    "viewsCount": 150,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "categoryId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "E-commerce"
    },
    "createdBy": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

## Examples

### Basic Search
```
GET /websites?search=react
```

### Filter by Category and Type
```
GET /websites?categoryId=507f1f77bcf86cd799439011&type=ecommerce
```

### Price Range with Features
```
GET /websites?minPrice=100&maxPrice=500&isResponsive=true&hasAdminPanel=true
```

### Technologies Filter
```
GET /websites?technologies=react,nodejs,vue
```

### Advanced Search with Pagination
```
GET /websites?search=shop&type=ecommerce&minPrice=200&maxPrice=800&sortBy=price&sortOrder=asc&limit=20&page=1
```

### Available Websites Only
```
GET /websites?available=true&sortBy=viewsCount&sortOrder=desc
```

## Website Types
- `ecommerce` - E-commerce websites
- `blog` - Blog websites
- `portfolio` - Portfolio websites
- `corporate` - Corporate websites
- `landing` - Landing pages
- `dashboard` - Dashboard applications
- `other` - Other types

## Website Status
- `available` - Available for purchase
- `sold` - Already sold
- `reserved` - Reserved by someone

## Sortable Fields
- `name` - Website name
- `price` - Website price
- `createdAt` - Creation date
- `viewsCount` - Number of views
- `type` - Website type
- `status` - Website status

## Notes
- All string searches are case-insensitive
- Array parameters (technologies, features) can be passed as comma-separated strings
- Boolean parameters accept `true`/`false` or `1`/`0`
- Price filters work with numeric values only
- Pagination is 0-based (page 0 is the first page)
- Response is a direct array of websites without pagination metadata 