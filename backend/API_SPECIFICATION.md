# Grocery Inventory Management API Specification

## Database Models

### User Model
```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  tokens          Token[]
  items           Item[]
  stockUpdates    StockUpdate[]
}
```

### Token Model
```prisma
model Token {
  id          Int       @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean   @default(false)
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
}
```

### Item Model
```prisma
model Item {
  id             String        @id @default(cuid())
  name           String
  category       String
  brand          String?
  quantity       Float
  unit           String
  stockLevel     String
  minStockLevel  Float
  price          Float?
  lastUpdated    DateTime      @default(now())
  updatedBy      String
  notes          String?
  imageUrl       String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  user           User          @relation(fields: [userId], references: [id])
  userId         Int
  stockUpdates   StockUpdate[]
}
```

### StockUpdate Model
```prisma
model StockUpdate {
  id          String   @id @default(cuid())
  itemId      String
  oldQuantity Float
  newQuantity Float
  updatedBy   String
  notes       String?
  createdAt   DateTime @default(now())
  item        Item     @relation(fields: [itemId], references: [id])
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
}
```

---

## Authentication Endpoints

### Login User
EP: POST /auth/login
DESC: Authenticate user and return access/refresh tokens.
IN: body:{email:str!, password:str!}
OUT: 200:{user:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Invalid credentials", "401":"Email not verified", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"user@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2024-01-01T00:00:00Z","updatedAt":"2024-01-01T00:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIs...","expires":"2024-01-01T01:00:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIs...","expires":"2024-01-08T00:00:00Z"}}}

---

### Register User
EP: POST /auth/register
DESC: Create new user account and return access/refresh tokens.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"User already exists with this email", "422":"Invalid email or password format", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":2,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2024-01-01T00:00:00Z","updatedAt":"2024-01-01T00:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIs...","expires":"2024-01-01T01:00:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIs...","expires":"2024-01-08T00:00:00Z"}}}

---

### Refresh Token
EP: POST /auth/refresh
DESC: Refresh access token using valid refresh token.
IN: body:{refreshToken:str!}
OUT: 200:{user:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"401":"Invalid or expired refresh token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/refresh -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIs..."}'
EX_RES_200: {"user":{"id":1,"email":"user@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2024-01-01T00:00:00Z","updatedAt":"2024-01-01T00:00:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIs...","expires":"2024-01-01T01:00:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIs...","expires":"2024-01-08T00:00:00Z"}}}

---

### Logout User
EP: POST /auth/logout
DESC: Logout user and blacklist refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"401":"Invalid refresh token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIs..."}'
EX_RES_204: {}

---

## Item Management Endpoints

### Get All Items
EP: GET /items
DESC: Retrieve all grocery items with optional filtering.
IN: query:{category:str?, stockLevel:str?, search:str?, page:int?, limit:int?}
OUT: 200:{results:arr[{id:str, name:str, category:str, brand:str?, quantity:float, unit:str, stockLevel:str, minStockLevel:float, price:float?, lastUpdated:str, updatedBy:str, notes:str?, imageUrl:str?}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET "/items?category=dal&stockLevel=high&search=toor&page=1&limit=10" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
EX_RES_200: {"results":[{"id":"1","name":"Toor Dal","category":"dal","brand":"Fortune","quantity":2,"unit":"kg","stockLevel":"high","minStockLevel":1,"price":180,"lastUpdated":"2024-01-20T10:30:00Z","updatedBy":"Priya","notes":"Buy organic variety next time"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

### Get Item By ID
EP: GET /items/:id
DESC: Retrieve specific grocery item by ID.
IN: params:{id:str!}
OUT: 200:{id:str, name:str, category:str, brand:str?, quantity:float, unit:str, stockLevel:str, minStockLevel:float, price:float?, lastUpdated:str, updatedBy:str, notes:str?, imageUrl:str?}
ERR: {"401":"Unauthorized", "404":"Item not found", "500":"Internal server error"}
EX_REQ: curl -X GET /items/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
EX_RES_200: {"id":"1","name":"Toor Dal","category":"dal","brand":"Fortune","quantity":2,"unit":"kg","stockLevel":"high","minStockLevel":1,"price":180,"lastUpdated":"2024-01-20T10:30:00Z","updatedBy":"Priya","notes":"Buy organic variety next time"}

---

### Create New Item
EP: POST /items
DESC: Create a new grocery item in inventory.
IN: body:{name:str!, category:str!, brand:str?, quantity:float!, unit:str!, minStockLevel:float!, price:float?, notes:str?}
OUT: 201:{id:str, name:str, category:str, brand:str?, quantity:float, unit:str, stockLevel:str, minStockLevel:float, price:float?, lastUpdated:str, updatedBy:str, notes:str?, imageUrl:str?}
ERR: {"400":"Invalid input data", "401":"Unauthorized", "422":"Item with this name already exists", "500":"Internal server error"}
EX_REQ: curl -X POST /items -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." -d '{"name":"Moong Dal","category":"dal","brand":"Tata","quantity":1.5,"unit":"kg","minStockLevel":0.5,"price":120,"notes":"Yellow moong dal"}'
EX_RES_201: {"id":"11","name":"Moong Dal","category":"dal","brand":"Tata","quantity":1.5,"unit":"kg","stockLevel":"high","minStockLevel":0.5,"price":120,"lastUpdated":"2024-01-21T10:00:00Z","updatedBy":"John Doe","notes":"Yellow moong dal"}

---

### Update Item
EP: PUT /items/:id
DESC: Update existing grocery item information.
IN: params:{id:str!}, body:{name:str?, category:str?, brand:str?, quantity:float?, unit:str?, minStockLevel:float?, price:float?, notes:str?}
OUT: 200:{id:str, name:str, category:str, brand:str?, quantity:float, unit:str, stockLevel:str, minStockLevel:float, price:float?, lastUpdated:str, updatedBy:str, notes:str?, imageUrl:str?}
ERR: {"400":"Invalid input data", "401":"Unauthorized", "404":"Item not found", "403":"Not authorized to update this item", "500":"Internal server error"}
EX_REQ: curl -X PUT /items/1 -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." -d '{"quantity":3,"price":200}'
EX_RES_200: {"id":"1","name":"Toor Dal","category":"dal","brand":"Fortune","quantity":3,"unit":"kg","stockLevel":"high","minStockLevel":1,"price":200,"lastUpdated":"2024-01-21T11:00:00Z","updatedBy":"John Doe","notes":"Buy organic variety next time"}

---

### Delete Item
EP: DELETE /items/:id
DESC: Remove item from inventory permanently.
IN: params:{id:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "404":"Item not found", "403":"Not authorized to delete this item", "500":"Internal server error"}
EX_REQ: curl -X DELETE /items/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
EX_RES_204: {}

---

## User Management Endpoints (Admin Only)

### Get All Users
EP: GET /users
DESC: Retrieve paginated list of all users (admin only).
IN: query:{name:str?, role:str?, sortBy:str?, limit:int?, page:int?}
OUT: 200:{results:arr[{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Admin access required", "500":"Internal server error"}
EX_REQ: curl -X GET "/users?role=USER&page=1&limit=10" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
EX_RES_200: {"results":[{"id":1,"email":"user@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2024-01-01T00:00:00Z","updatedAt":"2024-01-01T00:00:00Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

### Get User By ID
EP: GET /users/:userId
DESC: Retrieve specific user by ID (admin only).
IN: params:{userId:int!}
OUT: 200:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Admin access required", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
EX_RES_200: {"id":1,"email":"user@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2024-01-01T00:00:00Z","updatedAt":"2024-01-01T00:00:00Z"}

---

### Create User
EP: POST /users
DESC: Create new user account (admin only).
IN: body:{email:str!, password:str!, name:str!, role:str!}
OUT: 201:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"User already exists", "401":"Unauthorized", "403":"Admin access required", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /users -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." -d '{"email":"newuser@example.com","password":"password123","name":"New User","role":"USER"}'
EX_RES_201: {"id":3,"email":"newuser@example.com","name":"New User","role":"USER","isEmailVerified":false,"createdAt":"2024-01-21T12:00:00Z","updatedAt":"2024-01-21T12:00:00Z"}

---

### Update User
EP: PATCH /users/:userId
DESC: Update user information (admin only).
IN: params:{userId:int!}, body:{email:str?, name:str?, role:str?, isEmailVerified:bool?}
OUT: 200:{id:int, email:str, name:str?, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input data", "401":"Unauthorized", "403":"Admin access required", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X PATCH /users/1 -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." -d '{"name":"Updated Name","isEmailVerified":true}'
EX_RES_200: {"id":1,"email":"user@example.com","name":"Updated Name","role":"USER","isEmailVerified":true,"createdAt":"2024-01-01T00:00:00Z","updatedAt":"2024-01-21T12:30:00Z"}

---

### Delete User
EP: DELETE /users/:userId
DESC: Delete user account permanently (admin only).
IN: params:{userId:int!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "403":"Admin access required", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
EX_RES_204: {}

---

## Category Constants

Valid categories for items:
- dal
- rice
- spices
- oil
- vegetables
- fruits
- dairy
- snacks
- condiments
- soap
- cleaning
- others

Valid stock levels:
- high
- medium
- low
- out

Valid units:
- kg
- gram
- liter
- ml
- piece
- packet
- bottle

Valid user roles:
- USER
- ADMIN

Valid token types:
- ACCESS
- REFRESH
- RESET_PASSWORD
- VERIFY_EMAIL