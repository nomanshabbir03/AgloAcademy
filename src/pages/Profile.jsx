import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { fetchMyEnrollments } from '../api/enroll';

const Profile = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const { showToast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
  });
  const [errors, setErrors] = useState({});
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const loadMyEnrollments = async () => {
      if (!user) return;
      setEnrollmentsLoading(true);
      try {
        const data = await fetchMyEnrollments();
        setMyEnrollments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load your enrollments:', error);
      } finally {
        setEnrollmentsLoading(false);
      }
    };

    loadMyEnrollments();
  }, [user]);

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      return;
    }
    
    setLoading(prev => ({ ...prev, profile: true }));
    
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        showToast('Profile updated successfully', 'success');
      } else {
        showToast(result.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showToast('An error occurred while updating profile', 'error');
      console.error('Update profile error:', error);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setLoading(prev => ({ ...prev, password: true }));
    
    try {
      const result = await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (result.success) {
        showToast('Password updated successfully', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        showToast(result.message || 'Failed to update password', 'error');
      }
    } catch (error) {
      showToast('An error occurred while updating password', 'error');
      console.error('Update password error:', error);
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('You have been logged out', 'info');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return null; // or redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account settings and preferences
            </p>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Change Password
              </button>
            </nav>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {activeTab === 'profile' ? (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-md`}
                      disabled={loading.profile}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md`}
                      disabled={loading.profile}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    disabled={loading.profile}
                  >
                    {loading.profile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                {/* Enrolled courses section */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Courses</h3>

                  {enrollmentsLoading ? (
                    <p className="text-sm text-gray-500">Loading your enrollments...</p>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Approved courses</h4>
                        {Array.isArray(user?.enrolledCourses) && user.enrolledCourses.length > 0 ? (
                          <ul className="space-y-2">
                            {user.enrolledCourses.map((course) => (
                              <li
                                key={course._id || course.id}
                                className="flex items-center justify-between px-4 py-2.5 bg-green-50 rounded-lg text-sm text-gray-800"
                              >
                                <div className="flex-1 min-w-0 mr-3">
                                  <Link
                                    to={`/courses/${course._id || course.id}`}
                                    className="block truncate font-medium text-gray-900 hover:text-primary"
                                  >
                                    {course.title || 'Course'}
                                  </Link>
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {course.type === 'paid' ? 'Paid course' : 'Free course'}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2 text-xs">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                    Approved
                                  </span>
                                  <Link
                                    to={`/courses/${course._id || course.id}`}
                                    className="inline-flex items-center px-3 py-1 rounded-md border border-green-200 text-green-700 hover:bg-green-50"
                                  >
                                    Go to course
                                  </Link>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            You do not have any approved courses yet.
                          </p>
                        )}
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Pending enrollment requests</h4>
                        {Array.isArray(myEnrollments) &&
                        myEnrollments.some((e) => e.status === 'pending') ? (
                          <ul className="space-y-2">
                            {myEnrollments
                              .filter((e) => e.status === 'pending')
                              .map((e) => (
                                <li
                                  key={e._id}
                                  className="flex items-center justify-between px-4 py-2.5 bg-yellow-50 rounded-lg text-sm text-gray-800"
                                >
                                  <div className="flex-1 min-w-0 mr-3">
                                    {e.course ? (
                                      <Link
                                        to={`/courses/${e.course._id || e.course.id}`}
                                        className="block truncate font-medium text-gray-900 hover:text-primary"
                                      >
                                        {e.course.title || 'Course'}
                                      </Link>
                                    ) : (
                                      <span className="truncate">Course</span>
                                    )}
                                    <p className="mt-0.5 text-xs text-gray-500">Paid course (awaiting verification)</p>
                                  </div>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                                    Pending admin approval
                                  </span>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            You do not have any pending enrollment requests.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="current-password"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm ${
                        errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md`}
                      disabled={loading.password}
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm ${
                        errors.newPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md`}
                      disabled={loading.password}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md`}
                      disabled={loading.password}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Logout
                  </button>
                  
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    disabled={loading.password}
                  >
                    {loading.password ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
