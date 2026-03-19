# Court Case Tracking System — Backend (server/)

This folder contains the **Node.js + Express + MongoDB** backend for the Court Case Tracking System / Legal Assistance Platform.

It includes:
- **JWT Authentication** (register/login)
- **User-owned cases** (every case belongs to a user)
- Case CRUD + **search/filter/pagination**
- **Case timeline** + **case history/activity log**
- **Lawyers** directory + filtering + case assignment
- **Document guidance** by case type
- **Notifications** + hourly **hearing reminders** (cron)
- **Dashboard** metrics (per user)
- Basic **AI “legal text simplification”** endpoint (mock)

---

## Tech stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- `cors`, `dotenv`
- `node-cron` for reminders

---

## Project structure (MVC)

```text
server/
├─ config/
│  └─ db.js
├─ controllers/
│  ├─ aiController.js
│  ├─ authController.js
│  ├─ caseController.js
│  ├─ dashboardController.js
│  ├─ documentController.js
│  ├─ lawyerController.js
│  └─ notificationController.js
├─ middleware/
│  ├─ authMiddleware.js
│  └─ errorMiddleware.js
├─ models/
│  ├─ Case.js
│  ├─ Document.js
│  ├─ Lawyer.js
│  ├─ Notification.js
│  └─ User.js
├─ routes/
│  ├─ aiRoutes.js
│  ├─ authRoutes.js
│  ├─ caseRoutes.js
│  ├─ dashboardRoutes.js
│  ├─ documentRoutes.js
│  ├─ lawyerRoutes.js
│  └─ notificationRoutes.js
├─ utils/
│  └─ reminderScheduler.js
├─ server.js
├─ package.json
├─ package-lock.json
└─ .env (local)
```

---

## Setup & run (local)

### 1) Install dependencies

From the `server/` directory:

```bash
npm install
```

### 2) Configure environment variables

Create `server/.env` (or update it) with:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/courtcase
JWT_SECRET=supersecret
REMINDER_CRON=0 * * * *
```

### 3) Start the server

```bash
npm run dev
```

Server health check:
- `GET /` → returns `API running`

---

## Authentication (JWT)

### How auth works

- User registers and logs in via `/api/auth/*`
- On successful login, server returns a **JWT token**
- For protected routes, client must send:

```text
Authorization: Bearer <JWT_TOKEN>
```

### Roles (RBAC)

The backend supports role-based access with:
- `role`: `user` | `lawyer` | `admin`
- `restrictTo(...roles)` middleware

Notes:
- The code normalizes some legacy role inputs (e.g., `Admin`, `Clerk`) to the new values.
- Protected admin routes:
  - `POST /api/documents` (configure document guidance)
  - `POST /api/lawyers` (create lawyer records)

---

## Database connection

**File**: `config/db.js`

- Connects using `mongoose.connect(process.env.MONGO_URI)`
- Exits process if `MONGO_URI` is missing or connection fails

---

## Data models (Mongoose)

### 1) User (`models/User.js`)

Fields:
- `name` (required)
- `email` (required, unique, lowercased)
- `password` (required, hashed with bcryptjs, not returned by default)
- `role` (`user` | `lawyer` | `admin` + some legacy values allowed)
- `username` (present to satisfy an existing DB unique index in some deployments)
- `createdAt` (via timestamps)

Behavior:
- Password is automatically hashed in a `pre('save')` hook
- `matchPassword()` compares plaintext password with the hash

### 2) Case (`models/Case.js`)

Mandatory ownership:
- `user: ObjectId(ref User)` (required)

Core fields:
- `caseNumber` (required, unique)
- `title` (required)
- `clientName` (required)
- `court` (required)
- `notes` (optional)
- `status`: `Filed` | `Hearing Scheduled` | `In Progress` | `Closed`
- `nextHearingDate` (Date, optional)

Legal assistance additions:
- `lawyer: ObjectId(ref Lawyer)` (optional)
- `timeline`: array of `{ stage, description, date }`
- `history`: array of `{ action, date }` (auto-logs create/status/timeline updates)

Important runtime note:
- `models/Case.js` includes a small safeguard to avoid stale mongoose model caching during hot reloads.

### 3) Notification (`models/Notification.js`)

- `user: ObjectId(ref User)` (required)
- `type` (String, default `general`)
- `case: ObjectId(ref Case)` (optional, used for hearing reminders)
- `scheduledFor` (Date, optional, used for hearing reminders)
- `message` (required)
- `read` (boolean, default false)
- `createdAt` (timestamps)

### 4) Document (`models/Document.js`)

Document guidance by case type:
- `caseType` (required, unique, stored lowercased)
- `documents: [String]`

### 5) Lawyer (`models/Lawyer.js`)

Fields:
- `name`, `specialization`, `location` (required)
- `experience` (number)
- `fees` (number)
- `rating` (0..5)

---

## Core backend rules & behavior

### User-based cases (mandatory)

All case endpoints are protected. A case is always tied to the authenticated user:
- On create: `case.user = req.user._id`
- On list/search/get-by-id/update/delete:
  - Only the owner can see/modify the case
  - Ownership is checked using a safe helper (`ensureOwned`) that works even if `user` is populated

### Case timeline system

- Add timeline events to visualize the lifecycle of a case
- Timeline updates also create a history record automatically

### Case history/activity log

Automatically logs:
- Case created
- Status updated
- Timeline event added

### Hearing reminder system (hourly cron)

**File**: `utils/reminderScheduler.js`

Schedule:
- Defaults to every hour (`0 * * * *`)
- Can be configured with `REMINDER_CRON` in `.env`

Behavior (every run):
- Query cases with `nextHearingDate` within the next 24 hours
- For statuses: `Hearing Scheduled` and `In Progress`
- Create a `Notification` for the case owner with:
  - `type: hearing_reminder`
  - `case: <Case _id>`
  - `scheduledFor: <nextHearingDate>`
  - `message: ...`
- De-duplicates reminders per `(user, case, scheduledFor)` to avoid spamming

This is a database-based “reminder trigger”. (Actual delivery like email/SMS can be integrated later.)

Testing tip (manual one-shot run):
- The scheduler exports a one-shot function `runReminderCheck()` which can be executed for testing without waiting an hour.

Example (PowerShell / bash):

```bash
node -e "require('dotenv').config(); require('./config/db')().then(async ()=>{ await require('./utils/reminderScheduler').runReminderCheck(); console.log('runReminderCheck complete'); process.exit(0); }).catch(e=>{ console.error(e); process.exit(1); });"
```

---

## API Routes (REST)

Base URL (local): `http://localhost:5000`

### Auth

#### Register
- **POST** `/api/auth/register`

Body:
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Password123",
  "role": "admin"
}
```

#### Login
- **POST** `/api/auth/login`

Body:
```json
{
  "email": "alice@example.com",
  "password": "Password123"
}
```

Response includes a JWT token. Use it for all protected endpoints.

---

### Cases (protected)

All `/api/cases/*` routes require:
```text
Authorization: Bearer <TOKEN>
```

#### Create case
- **POST** `/api/cases`

Body:
```json
{
  "caseNumber": "CASE-2026-001",
  "title": "State vs John Doe",
  "clientName": "John Doe",
  "court": "District Court",
  "status": "Filed",
  "nextHearingDate": "2026-03-25T10:00:00.000Z",
  "notes": "Initial filing"
}
```

Ownership:
- The server sets `user` from the token (`req.user._id`). You do not pass it in request body.

#### Get all cases (with filter + pagination)
- **GET** `/api/cases?status=Filed&court=District%20Court&page=1&limit=10`

Returns only the logged-in user’s cases.

#### Get case by id
- **GET** `/api/cases/:id`

Returns 404 if:
- case does not exist, OR
- case exists but belongs to a different user

#### Update case
- **PUT** `/api/cases/:id`

You can update fields like `status`, `nextHearingDate`, `notes`, `lawyer` etc.
Status updates are automatically logged in case history.

#### Delete case
- **DELETE** `/api/cases/:id`

#### Search by case number
- **GET** `/api/cases/search/:caseNumber`

Search is scoped to the logged-in user.

#### Upcoming hearings
- **GET** `/api/cases/upcoming/hearings`

Upcoming hearings for the logged-in user.

#### Timeline: add event
- **POST** `/api/cases/:id/timeline`

Body:
```json
{
  "stage": "Evidence Submitted",
  "description": "Evidence documents submitted to court",
  "date": "2026-03-20T12:00:00.000Z"
}
```

#### Timeline: get events
- **GET** `/api/cases/:id/timeline`

---

### Dashboard (protected)

- **GET** `/api/dashboard`

Returns:
```json
{
  "totalCases": 0,
  "openCases": 0,
  "closedCases": 0,
  "upcomingHearings": 0
}
```

All metrics are scoped to the logged-in user.

---

### Notifications (protected)

#### Get notifications
- **GET** `/api/notifications`

#### Create notification (manual)
- **POST** `/api/notifications`

Body:
```json
{ "message": "Your hearing is scheduled tomorrow at 10 AM." }
```

The cron system also creates notifications automatically.

---

### Document guidance (protected)

#### Create/Update required documents (admin only)
- **POST** `/api/documents`

Body:
```json
{
  "caseType": "criminal",
  "documents": ["FIR copy", "ID proof", "Bail application"]
}
```

#### Get required documents by case type
- **GET** `/api/documents/:caseType`

Example:
- `GET /api/documents/criminal`

---

### Lawyers (protected)

#### Create lawyer (admin only)
- **POST** `/api/lawyers`

Body:
```json
{
  "name": "Adv. Rahul Sharma",
  "specialization": "criminal",
  "location": "Pune",
  "experience": 7,
  "fees": 5000,
  "rating": 4.6
}
```

#### Get lawyers (with filtering)
- **GET** `/api/lawyers?specialization=criminal&location=Pune`

---

### AI legal simplification (protected, mock)

- **POST** `/api/ai/explain`

Body:
```json
{
  "text": "Hereby, the party of the first part shall..."
}
```

Response:
- `simplified` is a placeholder output (designed for future AI integration).

---

## Common debugging notes

### “Case not found” for GET by id / search

The backend enforces case ownership. If the case belongs to another user, you will get 404 even if it exists.

The ownership helper (`ensureOwned`) is implemented to work even when the `user` field is populated.

### Validation errors

- Most controllers return `400` with validation messages when Mongoose validation fails.
- If you see a generic `500`, check the server console logs for the underlying exception.

---

## Next enhancements (optional)

- Mark notifications as read (`PATCH /api/notifications/:id/read`)
- Prevent duplicate reminder notifications (store lastReminderAt per case)
- Add case attachments upload (S3/local disk)
- Add audit logging per request/user
- Add request validation middleware (Joi/Zod/celebrate)
- Add tests (Jest + supertest)

