import Service from '../models/Service.js';

export const getServices = async (req, res) => {
  try {
    const { featured, category, active } = req.query;
    const query = {};

    if (featured === 'true') {
      query.featured = true;
    }

    if (category) {
      query.category = category;
    }

    if (active === 'false') {
      query.isActive = false;
    } else {
      query.isActive = true;
    }

    const services = await Service.find(query).sort({ createdAt: -1 });
    return res.status(200).json(services);
  } catch (error) {
    console.error('Get services error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch services' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error('Get service details error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch service details' });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, category, price, deliveryTime, image, featured, isActive } = req.body;

    if (!title || !description || price == null) {
      return res.status(400).json({ message: 'Missing required service fields' });
    }

    const service = await Service.create({
      title,
      description,
      category,
      price,
      deliveryTime,
      image,
      featured: featured === true || featured === 'true',
      isActive: isActive === false || isActive === 'false' ? false : true,
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error.message);
    return res.status(500).json({ message: 'Failed to create service' });
  }
};

export const updateService = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.featured != null) {
      updates.featured = updates.featured === true || updates.featured === 'true';
    }

    if (updates.isActive != null) {
      updates.isActive = !(updates.isActive === false || updates.isActive === 'false');
    }

    const service = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error('Update service error:', error.message);
    return res.status(500).json({ message: 'Failed to update service' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error.message);
    return res.status(500).json({ message: 'Failed to delete service' });
  }
};
