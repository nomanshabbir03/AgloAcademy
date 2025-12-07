import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res) => {
  try {
    const { featured } = req.query;

    const query = {};

    if (featured === 'true') {
      query.featured = true;
    } else if (featured === 'false') {
      query.featured = false;
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    return res.status(200).json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    return res.status(200).json(testimonial);
  } catch (error) {
    console.error('Get testimonial details error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch testimonial details' });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, course, year, rating, image, quote, featured } = req.body;

    if (!name || !course || !year || !rating || !image || !quote) {
      return res.status(400).json({ message: 'Missing required testimonial fields' });
    }

    const testimonial = await Testimonial.create({
      name,
      course,
      year,
      rating,
      image,
      quote,
      featured: featured === true || featured === 'true',
    });

    return res.status(201).json(testimonial);
  } catch (error) {
    console.error('Create testimonial error:', error.message);
    return res.status(500).json({ message: 'Failed to create testimonial' });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const updates = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    return res.status(200).json(testimonial);
  } catch (error) {
    console.error('Update testimonial error:', error.message);
    return res.status(500).json({ message: 'Failed to update testimonial' });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    return res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error.message);
    return res.status(500).json({ message: 'Failed to delete testimonial' });
  }
};