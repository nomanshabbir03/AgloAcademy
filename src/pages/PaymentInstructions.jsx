import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { enrollInCourseRequest } from '../api/courses';

const PaymentInstructions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState(null);

  if (!user) {
    // Safety: this route should be protected at router level, but guard just in case
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (note) {
        formData.append('paymentNote', note);
      }
      if (screenshot) {
        formData.append('paymentScreenshot', screenshot);
      }

      await enrollInCourseRequest(id, formData);
      showToast(
        'Enrollment request submitted with your payment details. It is pending admin approval.',
        'success'
      );
      navigate(`/courses/${id}`);
    } catch (err) {
      console.error('Payment enrollment failed:', err);
      const message =
        err?.response?.data?.message || 'Failed to submit enrollment request. Please try again.';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Bank Transfer Payment</h1>
          <p className="text-gray-600 mb-6 text-sm">
            Please make the payment using the bank details below from your banking app, then upload
            a screenshot or add a clear note about your transaction reference. Once submitted, an
            admin will verify the payment and approve your course access.
          </p>

          <div className="mb-8 border border-gray-100 rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Bank Account Details</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><span className="font-medium">Account Name:</span> Aglo Academy</li>
              <li><span className="font-medium">Bank Name:</span> Your Bank Name</li>
              <li><span className="font-medium">Account Number:</span> 1234 5678 9012</li>
              <li><span className="font-medium">IBAN:</span> PK00XXXX0000000000000000</li>
              <li><span className="font-medium">Reference:</span> Use your full name and course name</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="note">
                Payment details / note
              </label>
              <textarea
                id="note"
                rows="4"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Paste your transaction ID or describe the payment (you can also mention that you shared a screenshot with admin)."
              />
              <p className="mt-1 text-xs text-gray-500">
                Screenshots can be shared via your preferred channel (e.g. WhatsApp / email) if
                needed. This note helps the admin match your payment.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="paymentScreenshot">
                Payment screenshot (optional)
              </label>
              <input
                id="paymentScreenshot"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  setScreenshot(file || null);
                }}
                className="w-full text-sm text-gray-700"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can upload a screenshot of your bank transfer to help the admin verify your payment.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6">
              <Link
                to={`/courses/${id}`}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Back to course
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-6 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit payment details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;
