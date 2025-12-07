import { useEffect, useState } from 'react';
import { fetchServices } from '../api/services';

const DigitalServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchServices();
        setServices(data || []);
      } catch (err) {
        console.error('Failed to load services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional digital services like video editing and social media marketing to help you
            grow your online presence.
          </p>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-600">No services are available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
              >
                {service.image && (
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">{service.title}</h2>
                    {typeof service.price === 'number' && (
                      <span className="text-primary-600 font-semibold text-sm ml-3 whitespace-nowrap">
                        Rs {service.price}
                      </span>
                    )}
                  </div>
                  {service.category && (
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                      {service.category}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm mb-3 flex-1">{service.description}</p>
                  {service.deliveryTime && (
                    <p className="text-xs text-gray-500 mb-3">
                      Delivery time: <span className="font-medium">{service.deliveryTime}</span>
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Contact us via WhatsApp to order this service.</p>
                    <a
                      href="https://wa.me/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-primary-600 text-white hover:bg-primary-700"
                    >
                      Get This Service
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalServices;
