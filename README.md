# ShopSphere - Full-Stack E-commerce Website

A complete online store: browse and search products, view details, manage a cart,
register / log in, place orders and view order history.

## Tech Stack
- **Frontend:** React 18, Vite, React Router
- **Backend:** Node.js, Express
- **Auth:** JWT + bcrypt password hashing
- **Storage:** JSON file (`server/data/db.json`), easy to swap for MongoDB/PostgreSQL

## Features
- Product catalogue with search, category filter and sorting
- Product detail page
- Shopping cart (persisted in localStorage)
- User registration and login (JWT)
- Protected checkout; order totals are calculated on the server (client prices are never trusted)
- Order history page

## Run Locally

Backend:
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Frontend (new terminal):
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

## Environment Variables
Server (`server/.env`): `PORT`, `JWT_SECRET`
Client: `VITE_API_URL` (defaults to http://localhost:5000)

## API
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | no | List products (`?search=&category=&sort=`) |
| GET | /api/products/:id | no | Single product |
| POST | /api/auth/register | no | Create account |
| POST | /api/auth/login | no | Log in, returns JWT |
| GET | /api/auth/me | yes | Current user |
| POST | /api/orders | yes | Place an order |
| GET | /api/orders | yes | My orders |

## Future Improvements
- Real database (PostgreSQL / MongoDB)
- Stripe payments
- Admin dashboard for products and orders
- Product reviews and wishlist
