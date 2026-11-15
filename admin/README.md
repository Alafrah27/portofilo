# Musdar admin

React admin dashboard with backend-verified administrator access.

## Development

Start the backend from its own folder with `npm run dev`, then run `npm run dev` here. The dashboard uses http://localhost:5173 and proxies /api requests to http://127.0.0.1:5000. Keep port 5173 free; the backend permits the localhost and 127.0.0.1 admin origins by default.

Use `npm run create-admin` in the backend folder to provision an administrator. There is no demo login or public signup.

## Authentication

- Every dashboard route waits for a server session check. Anonymous sessions and non-admin users redirect to /login without rendering dashboard content.
- Login uses the backend /api/auth/login endpoint. Errors are shown in the form; only verified administrators can continue.
- A valid login returns to the originally requested internal page, including query parameters. Signed-in admins visiting /login return to the dashboard.
- Sessions survive page reloads through HttpOnly cookies. No password or token is stored in browser storage.
- An expired access session triggers one shared refresh request. A missing, revoked, or forbidden session returns to login.
- Sessions are checked on route changes, window focus, and once a minute while the page is visible. Offline/server errors deny access and display a retry option on login.
- Sign out revokes the backend session and clears cookies before redirecting. If the server cannot confirm sign-out, an error is shown so the user can retry.

## Deployment

`npm run dev` loads `.env.development`: `VITE_API_BASE_URL=http://localhost:5000/api` and `VITE_WEBSITE_URL=http://localhost:5174`. `npm run build` loads `.env.production`: `VITE_API_BASE_URL=/api` and `VITE_WEBSITE_URL=https://musdar.com`. Use `.env.development.local` for personal local overrides; do not put localhost in Netlify's production environment.

For a Netlify site, set its base directory to `admin`. `netlify.toml` sets the build command to `npm run build`, publish directory to `dist`, and the public production environment variables. If setting them in the Netlify dashboard instead, use the same values above and rebuild after changes. The generated `dist/_redirects` proxies `/api/*` to `https://portofilo-5717.onrender.com/api/:splat` before applying the SPA history fallback. The proxy keeps administrator cookies on the dashboard's origin.

On Render, set `ADMIN_ORIGINS` to the deployed dashboard's exact origin (for example, `https://your-admin-site.netlify.app`, without `/login` or a trailing slash), then deploy the environment change. This is required for browser sign-in. Keep the production admin's `VITE_API_BASE_URL=/api` when using Netlify; pointing it directly at the unrelated `onrender.com` origin would prevent SameSite=Lax session cookies from working.

Alternatively set `VITE_API_BASE_URL` to a same-site backend API URL (ending in `/api`), add the exact admin origin to the backend `ADMIN_ORIGINS`, and use HTTPS in production. These values are public; JWT secrets belong only in backend environment settings.

Projects use the real backend: list, preview, create, edit, and confirmed delete. The overview project count and recent projects also use saved data. Tasks are also saved in MongoDB; other overview metrics remain demo data.

Project name, story, and at least one image are required. Upload JPEG/PNG/WebP files, up to 10 images and 5MB per image. Editing without new images keeps the gallery; choosing new images replaces it on save. Failed saves keep the form open. No Cloudinary credentials are included in the frontend.

The optional Live website URL accepts an absolute HTTP(S) address without embedded credentials. Clear it to remove the public live-site link. The project popup has a scrolling content region, a separately scrolling story editor, and a fixed header/footer so formatting and Save remain usable with long stories.

## Tasks

The Tasks page supports create, edit, direct status changes, confirmed delete, and combined status/priority filters. Task titles are required (up to 200 characters). Project and deadline are optional; the project selector uses saved projects. Defaults: To do, Medium priority, No project, No deadline. Deadlines use a date picker and display the selected calendar date without timezone shifts.

All task endpoints require an administrator. All administrators share the task workspace. Removing a project keeps its tasks, displayed as No project. Loading and server errors provide retry actions; failed saves retain form values. A project-list failure still permits standalone tasks.

## Checks

- `npm test`: API-client and authentication-state regression tests, using mocked responses and no real credentials or database.
- `npm run lint`: ESLint.
- `npm run build`: production build.
