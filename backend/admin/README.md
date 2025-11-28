# Admin Panel Backend Structure (Planned)

This folder is reserved for future **Admin Panel** backend functionality. The admin panel will allow authorized administrators to manage courses, users, and platform settings.

## Planned Structure

- `routes/` – Admin-specific Express route definitions (e.g. `/api/admin/courses`, `/api/admin/users`).
- `controllers/` – Route handlers implementing admin logic.
- `services/` – Business logic for complex admin operations.
- `middleware/` – Additional middleware for admin-only authorization and logging.

## Adding Admin Routes (Future)

1. Create a route file (e.g. `routes/adminCourses.js`) inside this folder or under `backend/routes/`.
2. Implement request handlers in a corresponding controller file (e.g. `controllers/adminCoursesController.js`).
3. Protect routes with admin-only middleware using roles from the `User` model.
4. Mount the admin routes in `backend/server.js` under a prefix such as `/api/admin`.

> Note: Admin functionality is **not implemented yet**. This folder exists to keep the backend ready for future expansion.
