import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

/* =======================
   Lazy Loaded Pages
======================= */
const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const DigitalServices = lazy(() => import('./pages/DigitalServices'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Profile = lazy(() => import('./pages/Profile'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const PaymentInstructions = lazy(() => import('./pages/PaymentInstructions'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
const MyLearning = lazy(() => import('./pages/MyLearning'));

/* =======================
   React Query Client
======================= */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/* =======================
   Loading Fallback
======================= */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

/* =======================
   Error Boundary
======================= */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || 'Unexpected error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* =======================
   Protected Routes
======================= */
const ProtectedRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth();

  if (loading || !initialized) return <LoadingFallback />;

  if (!user) {
    const from = window.location.pathname + window.location.search;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(from)}`}
        replace
      />
    );
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

const AdminRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth();

  if (loading || !initialized) return <LoadingFallback />;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

/* =======================
   App Content
======================= */
const AppContent = () => {
  const { initialized } = useAuth();

  // ✅ Prevents infinite loading before auth resolves
  if (!initialized) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary-muted/5">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow pt-16">
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />

            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/:id/pay"
              element={
                <ProtectedRoute>
                  <PaymentInstructions />
                </ProtectedRoute>
              }
            />

            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/digital-services" element={<DigitalServices />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-learning"
              element={
                <ProtectedRoute>
                  <MyLearning />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/gallery"
              element={
                <AdminRoute>
                  <AdminGallery />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

/* =======================
   App Wrapper
======================= */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
