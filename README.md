# API Gateway

A lightweight API Gateway built from scratch using Node.js, Express and Axios. Acts as a single entry point for routing requests to backend microservices, with support for dynamic service registration, load balancing, and JWT authentication.

## Architecture

```
Client → API Gateway (port 3000) → Service Registry → Microservice Instances
```

The gateway has two responsibilities:

- **Control plane** — service registration, enable/disable instances, authentication
- **Data plane** — request forwarding and round-robin load balancing

## Features

- Dynamic service registration and deregistration
- Round-robin load balancing across multiple instances of the same service
- Enable/disable individual service instances without unregistering
- JWT authentication — all admin and routing endpoints are protected
- Graceful shutdown — services automatically deregister on exit
- Security headers via Helmet

## Project Structure

```
api-gateway/
├── gateway.js          # Main Express app, port 3000
├── routes/
│   ├── index.js        # Request forwarding and load balancing logic
│   └── registry.json   # Service registry (auto-populated)
├── services/
│   ├── products.js     # Products microservice
│   └── orders.js       # Orders microservice
├── .env.example
└── package.json
```

## Getting Started

**1. Install dependencies**
```
npm install
```

**2. Set up environment variables**
```
cp .env.example .env
```

Fill in the values in `.env`:
```
JWT_SECRET=yoursecretkey
GATEWAY_PORT=3000
PRODUCTS_PORT=3001
ORDERS_PORT=3005
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```

**3. Start the gateway**
```
npm run dev
```

**4. Start a service**
```
node services/products.js
node services/orders.js
```

Services self-register with the gateway on startup and deregister on shutdown.

## API Endpoints

### Auth
```
POST /login
Body: { "username": "admin", "password": "password" }
Returns: { "token": "..." }
```

All endpoints below require the token in the Authorization header:
```
Authorization: Bearer <token>
```

### Service Management
```
POST /register        — Register a service instance
POST /unregister      — Deregister a service instance
POST /enable/:name    — Enable or disable a service instance
```

### Routing

Requests to `/:serviceName` are forwarded to the corresponding registered service.

```
GET  /products
GET  /products/:id
POST /products

GET  /orders
GET  /orders/:id
POST /orders
```

## Load Balancing

When multiple instances of the same service are registered, the gateway distributes requests across them using round-robin. If an instance is disabled or unavailable, it is skipped automatically.

To run multiple instances of the same service, change the port and restart:
```
PRODUCTS_PORT=3001 node services/products.js
PRODUCTS_PORT=3002 node services/products.js
```
