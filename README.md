# Future Skills Academy Website

A modern, responsive React website for a training academy built with Vite, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Design**: Clean, professional design with blue and white theme
- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Powered by Framer Motion for engaging user experience
- **Interactive Components**: 
  - Hero slider with auto-rotation
  - Course cards with hover effects
  - Animated navigation
  - Contact form with validation
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## 📁 Project Structure

```
training-academy-website/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation header
│   │   ├── Footer.jsx      # Site footer
│   │   ├── Slider.jsx      # Hero slider component
│   │   └── CourseCard.jsx  # Course display card
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Homepage
│   │   ├── Courses.jsx     # Courses listing page
│   │   ├── About.jsx       # About page
│   │   └── Contact.jsx     # Contact page
│   ├── data/               # Static data
│   │   └── courses.js      # Course information
│   ├── styles/             # Styling files
│   ├── assets/             # Images and static assets
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static public files
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md              # This file
```

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

## 🚀 Getting Started

### Step 1: Navigate to the Project Directory

```bash
cd training-academy-website
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Development Server

```bash
npm run dev
```

The website will be available at: `http://localhost:3000`

### Step 4: Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Step 5: Preview Production Build

```bash
npm run preview
```

## 📱 Pages Overview

### Home Page (`/`)
- Hero slider with 3 slides
- Introduction section
- Statistics showcase (2000+ Students, 50+ Courses, etc.)
- Featured courses grid
- Call-to-action sections

### Courses Page (`/courses`)
- Search and filter functionality
- Grid layout of all courses
- Course cards with ratings, duration, and instructor info
- Responsive design

### About Page (`/about`)
- Mission and vision statements
- Core values
- Academy story
- Leadership team showcase
- Call-to-action

### Contact Page (`/contact`)
- Working contact form
- Contact information
- Office hours
- FAQ section

## 🎨 Design Features

- **Color Scheme**: Primary blue (#3b82f6) with white and gray accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach
- **Accessibility**: Proper ARIA labels and semantic HTML

## 🔧 Customization

### Adding New Courses

Edit `src/data/courses.js` to add or modify courses:

```javascript
{
  id: 7,
  title: "New Course Title",
  description: "Course description...",
  image: "https://example.com/image.jpg",
  duration: "8 weeks",
  level: "Beginner",
  price: "$999",
  instructor: "Instructor Name",
  rating: 4.8,
  students: 500
}
```

### Modifying Colors

Update the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Update navigation in `src/components/Navbar.jsx`

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   npm run dev -- --port 3001
   ```

2. **Dependencies not installing**
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Build errors**
   ```bash
   npm run build
   ```

## 📄 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please contact:
- Email: info@futureskillsacademy.com
- Phone: +1 (555) 123-4567

## 📜 License

This project is licensed under the MIT License.

---

**Future Skills Academy** - Empowering the next generation with cutting-edge skills and knowledge for a successful future in the digital world.

---

## 🧰 Backend Setup Guide

The project includes a Node.js/Express backend in the `backend/` directory for authentication, courses, and enrollment. The frontend structure and design remain unchanged.

### 1. Clone the Project

```bash
git clone <your-repo-url>
cd training-academy-website
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Copy the example file and update values as needed:

```bash
cp .env.example .env
```

Environment variables:

- `MONGO_URI` – MongoDB connection string (local instance or MongoDB Atlas).
- `JWT_SECRET` – Strong secret used to sign JWT tokens.
- `FRONTEND_URL` – URL of the frontend (e.g. `http://localhost:5173`).
- `PORT` – Port for the backend server (default `5000`).
- `LOG_LEVEL` – Morgan logging level (e.g. `dev`, `combined`).

### 4. Connect MongoDB (Local or Atlas)

- **Local MongoDB** (default):
  - Install MongoDB Community Server.
  - Use: `MONGO_URI=mongodb://localhost:27017/academy_db`.

- **MongoDB Atlas**:
  - Create a cluster in Atlas.
  - Whitelist your IP or use `0.0.0.0/0` for development.
  - Create a database user and copy the connection string.
  - Set `MONGO_URI` in `.env` to that connection string.

### 5. Run Backend in Development Mode

From the `backend/` folder:

```bash
npm run dev
```

The backend will start on `http://localhost:5000` (or the port defined in `PORT`). A health check is available at:

- `GET /api/health` → `{ "status": "ok" }`

### 6. Backend API Endpoints Overview

**Auth**

- `POST /api/auth/register` – Register a new user (student by default).
- `POST /api/auth/login` – Login with email and password, returns JWT + basic user info.
- `GET /api/auth/me` – Get the current authenticated user profile (requires `Authorization: Bearer <token>`).

**Courses**

- `GET /api/courses` – List all courses.
- `GET /api/courses/:id` – Get course details.
  - Free courses: full access for everyone.
  - Paid courses: always return metadata; only include `googleDriveLink` for enrolled students or staff.
- `POST /api/courses` – Create a new course (admin only, placeholder for future admin panel).
- `PUT /api/courses/:id` – Update a course (admin only).
- `DELETE /api/courses/:id` – Delete a course (admin only).

**Enrollment**

- `POST /api/enroll/:courseId` – Enroll the current student into a course (dummy/manual enrollment for now). Requires authentication as a `student`.

### 7. Authentication Workflow (JWT)

1. User registers via `POST /api/auth/register`.
2. User logs in via `POST /api/auth/login` with email + password.
3. Backend validates credentials, then issues a JWT signed with `JWT_SECRET` containing `id` and `role`.
4. Frontend stores the token in `localStorage` and sends it as `Authorization: Bearer <token>` with subsequent requests.
5. Protected routes on the backend use middleware to verify the token and attach the user to `req.user`.

### 8. Course Access Logic (Free vs Paid)

- **Free courses**
  - Listed in `/api/courses`.
  - `GET /api/courses/:id` returns full details and any associated content.

- **Paid courses**
  - Listed in `/api/courses` like free courses.
  - `GET /api/courses/:id`:
    - Always returns title, description, and other basic fields.
    - Only includes `googleDriveLink` when the user is:
      - Enrolled in the course, or
      - Has role `admin` or `instructor`.

- **Enrollment**
  - `POST /api/enroll/:courseId` adds the course to `user.enrolledCourses`.
  - The frontend then refreshes the profile via `/api/auth/me` to reflect new enrollments.

---

## 🚀 Backend Deployment Guide

You can deploy the backend to platforms such as **Render**, **Railway**, or **Vercel (serverless functions)**.

### 1. General Deployment Steps

1. Push your code to GitHub or another Git provider.
2. Create a new project/service on Render/Railway/Vercel.
3. Set the root directory for the backend to `backend/`.
4. Configure the build/start commands (typically `npm install` and `npm start`).
5. Add environment variables matching your local `.env` (without committing `.env` itself).

### 2. Environment Variables in Production

At minimum set:

- `MONGO_URI` – Your production MongoDB/Atlas URI.
- `JWT_SECRET` – A strong, unique secret (do not reuse the dev secret).
- `FRONTEND_URL` – The public URL where your frontend is hosted.
- `PORT` – Often provided by the platform (e.g. `PORT` env var on Render/Railway).
- `LOG_LEVEL` – Use `combined` or `tiny` depending on logging needs.

### 3. CORS and Frontend Whitelisting

The backend uses CORS middleware configured as:

- `origin: FRONTEND_URL`
- `credentials: true`

For production:

- Ensure `FRONTEND_URL` is set to the exact origin of your frontend (e.g. `https://academy.yourdomain.com`).
- If you host multiple frontends, consider extending the CORS config to accept an array of allowed origins.

### 4. Platform-Specific Notes

- **Render / Railway**
  - Use a standard Node.js service.
  - Set the working directory to `backend/` if supported, or adjust commands accordingly.
  - Make sure `MONGO_URI` points to a publicly accessible MongoDB instance (e.g. MongoDB Atlas).

- **Vercel (Serverless)**
  - The current backend is built as a long-running Express server.
  - To deploy as pure serverless functions, you would typically:
    - Wrap route handlers as separate functions.
    - Adjust the entry point to match Vercel’s function conventions.
  - For now, prefer deploying to Render/Railway or a traditional Node host.

---

## 🧑‍💻 Backend Internal Developer Documentation

### Folder Structure

```bash
backend/
├── admin/                # Placeholder for future admin panel backend
├── models/               # Mongoose models (User, Course, Instructor)
├── routes/               # Express route definitions (auth, courses, enrollments)
├── middleware/           # Shared middleware (auth, error handling)
├── utils/                # Utility functions (e.g. JWT token generation)
├── package.json          # Backend dependencies and scripts
├── server.js             # Express app entry point
└── .env.example          # Sample environment variables
```

### Models / Controllers / Routes

- **Models** – Located in `backend/models/`:
  - `User.js` – User schema with roles and `enrolledCourses` relation to courses.
  - `Course.js` – Course schema including type (`free`/`paid`) and `googleDriveLink`.
  - `Instructor.js` – Optional schema for instructor metadata and their courses.

- **Routes** – Located in `backend/routes/`:
  - `auth.js` – Registration, login, and current user profile.
  - `courses.js` – Course listing, details, and admin CRUD endpoints.
  - `enrollments.js` – Enrollment endpoint for students.

- **Middleware** – Located in `backend/middleware/`:
  - `authMiddleware.js` – `protect` and `authorizeRoles` helpers.
  - `errorMiddleware.js` – `notFound` and `errorHandler` global error handlers.

- **Utils** – Located in `backend/utils/`:
  - `generateToken.js` – Creates JWT tokens for authenticated users.

### Adding a New API Route

1. **Create or update a model** (if needed) in `backend/models/`.
2. **Create a new route file** in `backend/routes/`, e.g. `notifications.js`.
3. Define route handlers using Express, optionally delegating logic to separate controller modules (e.g. `controllers/notificationsController.js` if you add a controllers layer later).
4. Mount the route in `server.js`, for example:

   ```js
   import notificationRoutes from './routes/notifications.js';
   app.use('/api/notifications', notificationRoutes);
   ```

5. If necessary, protect the route with `protect` and `authorizeRoles` middleware.
6. Update documentation in this README to describe new endpoints and behavior.
