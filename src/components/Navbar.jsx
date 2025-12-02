import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, GraduationCap, User, LogOut, UserCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { 
      name: 'Courses', 
      path: '/courses',
      submenu: [
        { name: 'All Courses', path: '/courses' },
        { name: 'AI & Machine Learning', path: '/courses/ai' },
        { name: 'Digital Marketing', path: '/courses/digital-marketing' },
        { name: 'Graphic Design', path: '/courses/graphic-design' },
        { name: 'Video Editing', path: '/courses/video-editing' }
      ]
    },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const closeMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Close dropdowns when pressing Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Handle window resize for better mobile experience
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeMenu();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        closeMenu();
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target) && userMenuOpen) {
        setUserMenuOpen(false);
      }
    }

    // Add event listeners when menu is open
    if (isOpen || userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, userMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Successfully logged out', 'success');
      navigate('/', { replace: true });
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Failed to log out. Please try again.', 'error');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      ref={menuRef}
      className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-white/70 via-white/30 to-white/70 dark:from-gray-900/70 dark:via-gray-900/30 dark:to-gray-900/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:dark:bg-gray-900/40 border-b border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(15,23,42,0.08)] transition-colors duration-300"
      aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center py-4">
          {/* Logo - Left */}
          <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary-accent" />
            <span className="text-2xl font-heading font-bold text-gray-900">
              Aglo Academy
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative font-medium transition-colors duration-300 font-sans ${
                    isActive(item.path)
                      ? 'text-primary-accent'
                      : 'text-gray-700 hover:text-primary-accent'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-accent"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Navigation - Right */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-accent/20 flex items-center justify-center text-primary-accent">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-gray-700 font-medium">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-700 transition-transform ${userMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[0_15px_45px_rgba(15,23,42,0.18)] py-1 z-50"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/my-learning"
                        className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        My Learning
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md font-medium text-gray-900 hover:bg-primary/20 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                >
                  Enroll Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                if (userMenuOpen) setUserMenuOpen(false);
              }}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

     {/* Mobile Navigation */}
<AnimatePresence>
  {isOpen && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 z-30"
        onClick={closeMenu}
      />

      {/* Mobile Menu */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        className="fixed inset-0 bg-white dark:bg-gray-900 z-40 flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-white/10">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <GraduationCap className="h-8 w-8 text-primary-accent" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Aglo Academy</span>
          </Link>
          <button onClick={closeMenu} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col justify-start items-stretch text-lg font-medium bg-white dark:bg-gray-900">
          {navItems.map((item, index) => (
            <div key={item.name} className="w-full">
              {item.submenu ? (
                <div>
                  {/* Main menu item */}
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex justify-between items-center w-full px-6 py-4 text-gray-900 dark:text-white hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors duration-200"
                  >
                    {item.name}
                    <ChevronDown
                      size={18}
                      className={`ml-2 transition-transform ${openDropdown === index ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Submenu */}
                  {openDropdown === index && (
                    <div className="flex flex-col">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={closeMenu}
                          className="block w-full px-6 py-3 text-gray-900 dark:text-white hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors duration-200"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  onClick={closeMenu}
                  className="block w-full px-6 py-4 text-gray-900 dark:text-white hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}

          {/* User area / auth buttons */}
          {user ? (
            <div className="w-full mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 px-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary-accent/20 flex items-center justify-center text-primary-accent overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.role === 'admin' ? 'Administrator' : 'Student'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <span>Profile</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/my-learning"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span>My Learning</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span>Admin Dashboard</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await handleLogout();
                    closeMenu();
                  }}
                  className="mt-1 w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-between"
                >
                  <span>Sign out</span>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col mt-4">
              <Link
                to="/register"
                onClick={closeMenu}
                className="block w-full text-center px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-200"
              >
                Enroll Now
              </Link>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full text-center px-6 py-4 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </motion.div>
    </>
  )}
</AnimatePresence>



    </nav>
  );
};

export default Navbar;
