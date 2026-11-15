# Musdar backend

Express 5 + MongoDB authentication and projects API for the admin workspace and public portfolio.

## Local setup

```sh
cd backend
npm install
```

Keep your existing `.env`. For a new checkout, copy `.env.example` to `.env` and set:

| Variable | Purpose |
| --- | --- |
| `MONGO_URL` | MongoDB connection string. The server connects and initializes the unique email index before listening. |
| `MONGO_DB_NAME` | Optional application database override. Set to `musdar` when the URI selects a system database such as `admin`; this preserves the URI's existing authentication settings. Otherwise the database named in the URI is used. |
| `JWT_ACCESS_SECRET` | Random signing secret of at least 32 bytes. |
| `JWT_REFRESH_SECRET` | A different random signing secret of at least 32 bytes. |
| `ADMIN_ORIGINS` | Comma-separated exact admin origins, without paths or trailing slashes. Defaults to `http://localhost:5173,http://127.0.0.1:5173` in development. Unset or blank in production permits public project reads while blocking browser access to admin endpoints. |
| `PORT` | HTTP port; defaults to `5000`. |
| `NODE_ENV` | `development`, `test`, or `production`. |

Generate each secret separately with:

```sh
node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(48).toString('hex'))"
```

Never commit `.env` or copy real secrets into `.env.example`. Unrelated Cloudinary settings are preserved.

```sh
npm run create-admin
npm run dev
```

The private command asks for an email and a hidden password, then confirmation. Passwords need at least 6 Unicode characters and at most 72 UTF-8 bytes (bcrypt's limit). Duplicate emails are rejected: existing users are never overwritten or silently promoted. Run the command from an interactive terminal; it does not accept passwords through arguments, environment variables, or piped input.

The server starts only after MongoDB is ready. `GET /health` preserves the existing health response. `npm start` runs without nodemon.

## Render deployment

Create a Node web service with root directory `backend`, build command `npm ci`, start command `npm start`, and health check path `/health`. Render supplies `PORT`; do not hardcode it. Set `NODE_ENV=production`, `MONGO_URL`, the two distinct JWT secrets, and any application database override and Cloudinary settings in the service's Environment page. Never put real secrets in Git.

The backend can deploy before the dashboard. If `ADMIN_ORIGINS` is missing, empty, or whitespace-only in production, startup logs a warning and keeps the browser admin allowlist empty. Public project GET requests remain available. It never falls back to localhost or trusts every site. An explicitly configured malformed origin still prevents startup.

Once the admin dashboard is deployed, add its exact origin as `ADMIN_ORIGINS` (for example, `https://admin.example.com`, without `/login` or a trailing slash), then save and deploy the environment change. Use a same-site API hostname or an `/api` reverse proxy for the dashboard's SameSite=Lax session cookies. The public portfolio needs no admin origin; configure its `VITE_API_URL` to this service's URL ending in `/api`.

## Authentication API

All routes below use `/api/auth`. Responses are marked `Cache-Control: no-store`.

| Method / path | Request | Success |
| --- | --- | --- |
| `POST /login` | JSON `{ "email": "admin@example.com", "password": "your password" }` | `200`, public user data, and both session cookies. Only admins can login. |
| `POST /refresh` | Refresh cookie; no body required. | `200`, public user data, and a new token pair. |
| `POST /logout` | Session cookies; no body required. | `204`, cookies cleared and the matching session revoked. Also succeeds when already logged out. |
| `GET /me` | Access cookie. | `200` and public user data after authentication and admin authorization. |

Public user responses contain only:

```json
{ "user": { "id": "MongoDB user ID", "email": "admin@example.com", "role": "admin" } }
```

Errors use `{ "error": { "message": "..." } }`. Malformed input returns `400`; invalid credentials or tokens return `401`; correct credentials for a non-admin return `403`. Unknown emails and incorrect passwords return the same message. Login permits ten attempts per IP per fifteen minutes, then returns `429` with `Retry-After`. There is no public registration or role-changing endpoint.

The admin frontend includes credentials in authentication requests. Equivalent request example from the configured admin origin:

```js
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const result = await response.json();

const currentUser = await fetch('http://localhost:5000/api/auth/me', {
  credentials: 'include',
});
```

Use the same hostname for the local admin and API (`localhost` for both, or `127.0.0.1` for both). Browser origins must match `ADMIN_ORIGINS`; untrusted origins and origin-less browser requests marked cross-site are rejected. Non-browser clients may omit `Origin`.

## Model and sessions

- User fields: normalized unique `email`, bcrypt-hashed `password`, `role` (`user` by default, or `admin`), private `accessToken` / `refreshToken` hashes, and timestamps.
- Passwords use bcrypt with 12 rounds through document creation / `.save()`. Use `.save()` when changing a password; raw MongoDB updates bypass Mongoose password hooks.
- Tokens are JWTs with separate secrets, explicit issuer/audience, distinct token types, unique IDs, and HS256 verification. Access lifetime: 15 minutes. Refresh lifetime: 7 days from the latest rotation.
- Cookies are host-only, HttpOnly, and SameSite=Lax. Production enables Secure and requires HTTPS. Access cookie path: `/api`; refresh cookie path: `/api/auth`.
- No raw token is returned in JSON or stored in MongoDB. Private fields are excluded from ordinary queries and stripped from model serialization even when explicitly selected.
- One active session per account. Login invalidates older sessions. Refresh atomically replaces both hashes; old tokens cannot be replayed, and only one concurrent refresh succeeds. A later frontend client should coordinate refresh calls so it makes only one at a time.
- Both middleware and refresh read the current database role. Demotion immediately prevents admin access; refresh also revokes the demoted account's matching session.
- Logout works with a valid refresh cookie even if the access cookie expired. A stale session cannot log out a newer session.
- `authenticate(config)` and `requireAdmin` are separate middleware, reusable for future admin API routes. The `/me` route demonstrates both.

The in-memory login limiter is intended for the current single-process server. A multi-instance deployment will need a shared rate-limit store. Deploy behind a same-site API hostname or reverse proxy compatible with SameSite=Lax. Set Express proxy trust only for the actual trusted proxy topology before relying on forwarded client IPs.

## Projects API

Projects contain `userId` (the creating admin's User reference), `title`, `description`, optional `websiteUrl` (empty by default), `images: [{ url, publicId }]`, `createdAt`, and `updatedAt`. All other fields are required; timestamps are automatic. No account details or session credentials are populated in public responses.

| Method / path | Access | Request / success |
| --- | --- | --- |
| `GET /api/projects` | Public | `200`, `{ projects: [...] }`, newest first. |
| `GET /api/projects/:id` | Public | `200`, `{ project: {...} }`. |
| `POST /api/projects` | Admin session | Multipart `title`, `description`, optional `websiteUrl`, and files named `images`; `201`, `{ project: {...} }`. |
| `PATCH /api/projects/:id` | Admin session | Multipart or JSON with changed `title` / `description` / `websiteUrl`; optional multipart `images`; `200`, `{ project: {...} }`. |
| `DELETE /api/projects/:id` | Admin session | `204`, project removed and Cloudinary images cleaned up. |

Title: 1–200 trimmed characters. Description: 1–100,000 trimmed characters; editor HTML is preserved. Render rich text using a sanitizer on the consuming website. Each project requires 1–10 images, JPEG/PNG/WebP only, at most 5MB per image. Send each file under the repeated `images` field; image URLs, owner IDs, timestamps, and other fields cannot be set in request bodies. PATCH without new files preserves existing images; new files replace the entire group. Empty PATCH requests are rejected.

`websiteUrl` accepts an absolute HTTP(S) URL up to 2,048 characters, without embedded credentials. Omit it on PATCH to preserve the existing link; send an empty string to remove it. Public list/detail responses include the link for the website's live-project buttons.

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the backend `.env` only. Multer keeps uploads in memory within the limits above; Cloudinary validates the image format and returns HTTPS URLs and public IDs. Missing configuration returns `503` for uploads without preventing authentication or public reads. Provider upload failures return `400` for invalid images or `502` for service errors; provider messages and secrets are not returned.

Public GET requests support cross-origin access from any website; use `credentials: 'omit'` on the public website. Writes require the existing admin access cookie and trusted `ADMIN_ORIGINS`, with authentication before file handling. The admin dashboard uses these endpoints to list, preview, create, edit, and delete projects.

Malformed project IDs return `400`, missing projects `404`, and concurrent update conflicts `409`. Failed uploads/database writes clean any new images. Replaced images are removed after saving; deleting a project removes its database record before cleaning the images. A Cloudinary cleanup failure is logged without reversing a successful database write and requires manual Cloudinary cleanup.

## Tasks API

All `/api/tasks` endpoints require the existing admin session and return `Cache-Control: no-store`. All administrators share access; `userId` records the original creator and cannot be submitted or changed through this API.

| Method / path | Request / success |
| --- | --- |
| `GET /api/tasks` | `200`, `{ tasks: [...] }`, newest first. Optional validated `status` and `priority` query filters. |
| `GET /api/tasks/:id` | `200`, `{ task: {...} }`. |
| `POST /api/tasks` | JSON task fields; `201`, `{ task: {...} }`. |
| `PATCH /api/tasks/:id` | JSON changed task fields; `200`, `{ task: {...} }`. |
| `DELETE /api/tasks/:id` | `204`, task deleted. |

Writable fields: `title` (required on creation, 1–200 trimmed characters), `projectId` (existing Project ID or null; optional), `status` (`todo` default, `in-progress`, `done`), `priority` (`medium` default, `low`, `high`), and `dueDate` (valid `YYYY-MM-DD` or null; optional). The database adds creator `userId`, `createdAt`, and `updatedAt`. Unknown/protected fields, invalid values, and empty PATCH bodies return `400`; malformed IDs return `400`, missing tasks `404`, and conflicting updates `409`.

In responses, `projectId` is populated as `{ _id, title }`, or null for standalone tasks and deleted projects. Deleting a project does not delete its tasks. Deadlines are stored as UTC midnight and should be displayed as calendar dates using UTC. Task reads are private and do not use the projects API's public CORS policy.

## Tests

```sh
npm test
```

Tests use Node's test runner, Supertest, and a temporary MongoDB process from `mongodb-memory-server`. They never load your `.env` database connection. The first run may download the MongoDB test binary; later runs reuse the local cache.

Coverage includes schema defaults and privacy, hashing, admin-only login, token claims and cookie flags, authentication, rotation/replay/concurrency, logout, demotion, malformed requests, CORS/origin checks, rate limiting, and admin provisioning.

Project tests additionally cover required fields, public reads, admin-only writes, upload limits, image replacement and cleanup, storage errors, database failures, and concurrent updates. Cloudinary is mocked; tests do not upload live assets or use real credentials.

Task tests cover schema defaults, private/admin-only CRUD, shared admin access, optional links and deadlines, validation, filtering, creator protection, and preservation after project deletion.
