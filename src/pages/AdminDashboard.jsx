import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  fetchEnrollments,
  approveEnrollmentRequest,
  fetchAdminCourses,
  createCourseAdmin,
  updateCourseAdmin,
  deleteCourseAdmin,
} from '../api/admin';
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../api/blog';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [error, setError] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollmentFilter, setEnrollmentFilter] = useState('all');
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseFormError, setCourseFormError] = useState('');
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: '',
    thumbnail: '',
    duration: '',
    price: '',
    type: 'paid',
    googleDriveLink: '',
    level: '',
    featured: false,
  });
  const [blogs, setBlogs] = useState([]);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [savingBlog, setSavingBlog] = useState(false);
  const [blogFormError, setBlogFormError] = useState('');
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    readTime: '',
  });
  const [courseThumbnailFile, setCourseThumbnailFile] = useState(null);
  const [courseThumbnailPreview, setCourseThumbnailPreview] = useState('');
  const [blogImageFile, setBlogImageFile] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [enrollmentData, courseData, blogData] = await Promise.all([
          fetchEnrollments(),
          fetchAdminCourses(),
          fetchBlogs(),
        ]);
        setEnrollments(enrollmentData);
        setCourses(courseData || []);
        setBlogs(Array.isArray(blogData) ? blogData : []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        const message =
          err?.response?.data?.message || 'Failed to load admin data. Please try again later.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await approveEnrollmentRequest(id);
      setEnrollments((prev) =>
        prev.map((enrollment) =>
          enrollment._id === id ? { ...enrollment, status: 'approved' } : enrollment
        )
      );
      showToast('Enrollment approved and access granted.', 'success');
    } catch (err) {
      console.error('Failed to approve enrollment:', err);
      const message =
        err?.response?.data?.message || 'Failed to approve enrollment. Please try again later.';
      showToast(message, 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const openNewCourseModal = () => {
    setEditingCourse(null);
    setCourseForm({
      title: '',
      description: '',
      instructor: '',
      thumbnail: '',
      duration: '',
      price: '',
      type: 'paid',
      googleDriveLink: '',
      level: '',
      modules: [],
      featured: false,
    });
    setCourseThumbnailFile(null);
    setCourseThumbnailPreview('');
    setCourseFormError('');
    setCourseModalOpen(true);
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      instructor:
        typeof course.instructor === 'string'
          ? course.instructor
          : course.instructor?.name || '',
      thumbnail: course.thumbnail || '',
      duration: course.duration || '',
      price: course.price ?? '',
      type: course.type || 'paid',
      googleDriveLink: course.googleDriveLink || '',
      level: course.level || '',
      modules: Array.isArray(course.modules) ? course.modules : [],
      featured: !!course.featured,
    });
    setCourseThumbnailFile(null);
    setCourseThumbnailPreview(course.thumbnail || '');
    setCourseFormError('');
    setCourseModalOpen(true);
  };

  const handleCourseInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseForm((prev) => {
      if (name === 'featured') {
        return { ...prev, featured: !!checked };
      }
      if (name === 'type') {
        const nextType = value;
        // If course is free, force price to 0 for consistency
        if (nextType === 'free') {
          return { ...prev, type: nextType, price: '0' };
        }
        return { ...prev, type: nextType };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCourseThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setCourseFormError('Please select a valid image file.');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setCourseFormError('Image size should be less than 5MB.');
        return;
      }
      setCourseThumbnailFile(file);
      setCourseFormError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseThumbnailPreview(reader.result);
        setCourseForm((prev) => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setCourseFormError('');

    if (
      !courseForm.title ||
      !courseForm.description ||
      !courseForm.instructor ||
      (!courseForm.thumbnail && !courseThumbnailFile) ||
      !courseForm.duration ||
      courseForm.price === ''
    ) {
      setCourseFormError('Please fill in all required fields, including thumbnail image.');
      return;
    }

    setSavingCourse(true);
    try {
      const payload = {
        ...courseForm,
        // Ensure free courses always carry price 0 on the backend
        price: Number(courseForm.type === 'free' ? 0 : courseForm.price),
      };

      let saved;
      if (editingCourse) {
        saved = await updateCourseAdmin(editingCourse._id, payload);
        setCourses((prev) => prev.map((c) => (c._id === editingCourse._id ? saved : c)));
        showToast('Course updated successfully.', 'success');
      } else {
        saved = await createCourseAdmin(payload);
        setCourses((prev) => [saved, ...prev]);
        showToast('Course created successfully.', 'success');
      }

      setCourseModalOpen(false);
      setEditingCourse(null);
      setCourseThumbnailFile(null);
      setCourseThumbnailPreview('');
    } catch (err) {
      console.error('Save course failed:', err);
      const message =
        err?.response?.data?.message || 'Failed to save course. Please try again.';
      setCourseFormError(message);
      showToast(message, 'error');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    // Simple confirm for now to avoid accidental deletes
    if (!window.confirm(`Delete course "${course.title}"? This cannot be undone.`)) return;

    try {
      await deleteCourseAdmin(course._id);
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
      showToast('Course deleted successfully.', 'success');
    } catch (err) {
      console.error('Delete course failed:', err);
      const message =
        err?.response?.data?.message || 'Failed to delete course. Please try again.';
      showToast(message, 'error');
    }
  };

  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      image: '',
      readTime: '',
    });
    setBlogImageFile(null);
    setBlogImagePreview('');
    setBlogFormError('');
    setBlogModalOpen(true);
  };

  const openEditBlogModal = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || '',
      image: blog.image || '',
      readTime: blog.readTime || '',
    });
    setBlogImageFile(null);
    setBlogImagePreview(blog.image || '');
    setBlogFormError('');
    setBlogModalOpen(true);
  };

  const handleBlogInputChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setBlogFormError('Please select a valid image file.');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setBlogFormError('Image size should be less than 5MB.');
        return;
      }
      setBlogImageFile(file);
      setBlogFormError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogImagePreview(reader.result);
        setBlogForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setBlogFormError('');

    if (!blogForm.title || !blogForm.excerpt || !blogForm.content) {
      setBlogFormError('Please provide at least a title, excerpt, and full content for the blog.');
      return;
    }

    setSavingBlog(true);
    try {
      const payload = { ...blogForm };

      let saved;
      if (editingBlog) {
        saved = await updateBlog(editingBlog._id, payload);
        setBlogs((prev) => prev.map((b) => (b._id === editingBlog._id ? saved : b)));
        showToast('Blog post updated successfully.', 'success');
      } else {
        saved = await createBlog(payload);
        setBlogs((prev) => [saved, ...prev]);
        showToast('Blog post created successfully.', 'success');
      }

      setBlogModalOpen(false);
      setEditingBlog(null);
      setBlogImageFile(null);
      setBlogImagePreview('');
    } catch (err) {
      console.error('Save blog failed:', err);
      const message =
        err?.response?.data?.message || 'Failed to save blog post. Please try again.';
      setBlogFormError(message);
      showToast(message, 'error');
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (blog) => {
    if (!window.confirm(`Delete blog post "${blog.title}"? This cannot be undone.`)) return;

    try {
      await deleteBlog(blog._id);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
      showToast('Blog post deleted successfully.', 'success');
    } catch (err) {
      console.error('Delete blog failed:', err);
      const message =
        err?.response?.data?.message || 'Failed to delete blog post. Please try again.';
      showToast(message, 'error');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const pendingEnrollments = enrollments.filter((e) => e.status !== 'approved').length;
  const approvedEnrollments = enrollments.filter((e) => e.status === 'approved').length;

  const filteredEnrollments = enrollments.filter((e) => {
    if (enrollmentFilter === 'pending') return e.status !== 'approved';
    if (enrollmentFilter === 'approved') return e.status === 'approved';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage enrollment requests, courses, and blog posts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Pending Enrollments
            </p>
            <p className="text-2xl font-semibold text-yellow-600">{pendingEnrollments}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Approved Enrollments
            </p>
            <p className="text-2xl font-semibold text-green-600">{approvedEnrollments}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Total Courses
            </p>
            <p className="text-2xl font-semibold text-primary-600">{courses.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Enrollment Requests</h2>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500">Filter:</span>
              <select
                value={enrollmentFilter}
                onChange={(e) => setEnrollmentFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>

          {filteredEnrollments.length === 0 ? (
            <p className="text-gray-600 text-sm">No enrollments found for this filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Student</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Email</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Course</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Payment Note</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td className="px-4 py-2 text-gray-900">
                        {enrollment.user?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {enrollment.user?.email || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-900">
                        {enrollment.course?.title || 'Unknown course'}
                      </td>
                      <td className="px-4 py-2 text-gray-600 max-w-xs whitespace-pre-wrap text-xs">
                        {enrollment.paymentNote || '-'}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            enrollment.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEnrollment(enrollment)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          View details
                        </button>
                        {enrollment.status === 'approved' ? (
                          <span className="text-xs text-gray-500 align-middle">Already approved</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApprove(enrollment._id)}
                            disabled={approvingId === enrollment._id}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {approvingId === enrollment._id ? 'Approving...' : 'Approve'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Courses</h2>

          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-gray-500">
              Total courses: <span className="font-semibold">{courses.length}</span>
            </p>
            <button
              type="button"
              onClick={openNewCourseModal}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-primary-600 text-white hover:bg-primary-700"
            >
              + New Course
            </button>
          </div>

          {courses.length === 0 ? (
            <p className="text-gray-600 text-sm">No courses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Title</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Type</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Price</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Level</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Created</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td className="px-4 py-2 text-gray-900">{course.title}</td>
                      <td className="px-4 py-2 text-gray-700 text-xs uppercase">
                        {course.type === 'paid' ? 'Paid' : 'Free'}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {course.type === 'paid' ? `Rs ${course.price}` : 'Free'}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-xs">
                        {course.level || 'All Levels'}
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        {course.createdAt
                          ? new Date(course.createdAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditCourseModal(course)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Blog Posts</h2>

          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-gray-500">
              Total posts: <span className="font-semibold">{blogs.length}</span>
            </p>
            <button
              type="button"
              onClick={openNewBlogModal}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-primary-600 text-white hover:bg-primary-700"
            >
              + New Blog Post
            </button>
          </div>

          {blogs.length === 0 ? (
            <p className="text-gray-600 text-sm">No blog posts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Title</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Category</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Published</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="px-4 py-2 text-gray-900 max-w-xs truncate">{blog.title}</td>
                      <td className="px-4 py-2 text-gray-700 text-xs">
                        {blog.category || 'General'}
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditBlogModal(blog)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlog(blog)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedEnrollment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              type="button"
              onClick={() => setSelectedEnrollment(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Enrollment details</h3>
            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p>
                <span className="font-medium">Student:</span>{' '}
                {selectedEnrollment.user?.name} ({selectedEnrollment.user?.email})
              </p>
              <p>
                <span className="font-medium">Course:</span>{' '}
                {selectedEnrollment.course?.title}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                {selectedEnrollment.status}
              </p>
              <div>
                <p className="font-medium mb-1">Payment note</p>
                <p className="text-xs whitespace-pre-wrap bg-gray-50 border border-gray-100 rounded-md p-2">
                  {selectedEnrollment.paymentNote || 'No note provided.'}
                </p>
              </div>
            </div>

            {selectedEnrollment.paymentScreenshotUrl && (
              <div className="mb-4">
                <p className="font-medium text-sm text-gray-800 mb-2">Payment screenshot</p>
                <a
                  href={`${API_BASE_URL}${selectedEnrollment.paymentScreenshotUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-primary-600 hover:text-primary-700 underline mb-2"
                >
                  Open full image in new tab
                </a>
                <div className="border border-gray-200 rounded-md overflow-hidden max-h-64 flex items-center justify-center bg-gray-50">
                  <img
                    src={`${API_BASE_URL}${selectedEnrollment.paymentScreenshotUrl}`}
                    alt="Payment screenshot"
                    className="max-h-64 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEnrollment(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {courseModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 relative">
            <button
              type="button"
              onClick={() => {
                setCourseModalOpen(false);
                setEditingCourse(null);
                setCourseThumbnailFile(null);
                setCourseThumbnailPreview('');
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {editingCourse ? 'Edit Course' : 'New Course'}
            </h3>
            {courseFormError && (
              <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-xs font-medium text-red-700">{courseFormError}</p>
              </div>
            )}
            <form onSubmit={handleSaveCourse} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={courseForm.title}
                    onChange={handleCourseInputChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Instructor *</label>
                  <input
                    type="text"
                    name="instructor"
                    value={courseForm.instructor}
                    onChange={handleCourseInputChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  rows="3"
                  value={courseForm.description}
                  onChange={handleCourseInputChange}
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Thumbnail Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCourseThumbnailChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {courseThumbnailPreview && (
                    <div className="mt-2">
                      <img
                        src={courseThumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-32 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCourseThumbnailFile(null);
                          setCourseThumbnailPreview('');
                          setCourseForm((prev) => ({ ...prev, thumbnail: '' }));
                        }}
                        className="mt-1 text-xs text-red-600 hover:text-red-700"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleCourseInputChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                  <select
                    name="level"
                    value={courseForm.level}
                    onChange={handleCourseInputChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  >
                    <option value="">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    name="type"
                    value={courseForm.type}
                    onChange={handleCourseInputChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  >
                    <option value="paid">Paid</option>
                    <option value="free">Free</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price (Rs) *</label>
                  <input
                    type="number"
                    name="price"
                    value={courseForm.price}
                    onChange={handleCourseInputChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Drive Link</label>
                  <input
                    type="text"
                    name="googleDriveLink"
                    value={courseForm.googleDriveLink}
                    onChange={handleCourseInputChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="featured"
                  type="checkbox"
                  name="featured"
                  checked={!!courseForm.featured}
                  onChange={handleCourseInputChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="text-xs font-medium text-gray-700">
                  Featured course (show in home page featured section)
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Modules</label>
                <p className="text-[11px] text-gray-500 mb-2">
                  Add course modules or chapters with a title and short description. These will be
                  visible to all students; actual content access still depends on whether the course
                  is free or paid.
                </p>
                <div className="space-y-3">
                  {Array.isArray(courseForm.modules) && courseForm.modules.length > 0 ? (
                    courseForm.modules.map((mod, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-md p-3 bg-gray-50 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-700">
                            Module {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCourseForm((prev) => ({
                                ...prev,
                                modules: prev.modules.filter((_, i) => i !== index),
                              }));
                            }}
                            className="text-[11px] text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={mod.title || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCourseForm((prev) => {
                              const modules = [...(prev.modules || [])];
                              modules[index] = { ...modules[index], title: value };
                              return { ...prev, modules };
                            });
                          }}
                          placeholder="Module title"
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs mb-1"
                        />
                        <textarea
                          value={mod.description || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCourseForm((prev) => {
                              const modules = [...(prev.modules || [])];
                              modules[index] = { ...modules[index], description: value };
                              return { ...prev, modules };
                            });
                          }}
                          placeholder="Short description of this module"
                          rows="2"
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-500">No modules added yet.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCourseForm((prev) => ({
                      ...prev,
                      modules: [
                        ...(Array.isArray(prev.modules) ? prev.modules : []),
                        { title: '', description: '' },
                      ],
                    }));
                  }}
                  className="mt-2 inline-flex items-center px-3 py-1.5 rounded-md text-[11px] font-medium border border-dashed border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  + Add module
                </button>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setCourseModalOpen(false);
                    setEditingCourse(null);
                    setCourseThumbnailFile(null);
                    setCourseThumbnailPreview('');
                  }}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCourse}
                  className="px-4 py-2 text-xs font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-60"
                >
                  {savingCourse ? 'Saving...' : editingCourse ? 'Save changes' : 'Create course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {blogModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 relative">
            <button
              type="button"
              onClick={() => {
                setBlogModalOpen(false);
                setEditingBlog(null);
                setBlogImageFile(null);
                setBlogImagePreview('');
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
            </h3>
            {blogFormError && (
              <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-xs font-medium text-red-700">{blogFormError}</p>
              </div>
            )}
            <form onSubmit={handleSaveBlog} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={blogForm.title}
                  onChange={handleBlogInputChange}
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Short Excerpt *</label>
                <textarea
                  name="excerpt"
                  rows="2"
                  value={blogForm.excerpt}
                  onChange={handleBlogInputChange}
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Content *</label>
                <textarea
                  name="content"
                  rows="6"
                  value={blogForm.content}
                  onChange={handleBlogInputChange}
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={blogForm.category}
                    onChange={handleBlogInputChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Hero Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBlogImageChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {blogImagePreview && (
                    <div className="mt-2">
                      <img
                        src={blogImagePreview}
                        alt="Blog image preview"
                        className="w-full h-32 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBlogImageFile(null);
                          setBlogImagePreview('');
                          setBlogForm((prev) => ({ ...prev, image: '' }));
                        }}
                        className="mt-1 text-xs text-red-600 hover:text-red-700"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Read time</label>
                  <input
                    type="text"
                    name="readTime"
                    value={blogForm.readTime}
                    onChange={handleBlogInputChange}
                    placeholder="e.g. 5 min read"
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setBlogModalOpen(false);
                    setEditingBlog(null);
                    setBlogImageFile(null);
                    setBlogImagePreview('');
                  }}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBlog}
                  className="px-4 py-2 text-xs font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-60"
                >
                  {savingBlog ? 'Saving...' : editingBlog ? 'Save changes' : 'Create post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
