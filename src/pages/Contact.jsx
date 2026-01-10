import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { sendInquiry } from '../api/contact'
import { useToast } from '../context/ToastContext'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { showToast } = useToast()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await sendInquiry(formData)
      
      if (response.success) {
        setIsSubmitted(true)
        showToast(response.message || 'Your inquiry has been sent successfully!', 'success')
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({ name: '', email: '', subject: '', message: '' })
        }, 5000)
      } else {
        throw new Error(response.message || 'Failed to send inquiry')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send your inquiry. Please try again later.'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: 'E11 Islamabad Pakistan'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+923365116800\n+923061380308'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'tgdplanet@gmail.com'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-custom">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Get in touch with us. We'd love to hear from you and answer any questions you may have.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Send us a Message
                </h2>
                
                {isSubmitted ? (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                      <motion.div
                        className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Error</p>
                          <p className="text-sm">{error}</p>
                        </div>
                      </motion.div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="What's this about?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Get in Touch
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We're here to help and answer any question you might have. 
                    We look forward to hearing from you!
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <info.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-600 whitespace-pre-line">
                          {info.details}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Office Hours */}
                <motion.div
                  className="bg-primary-50 p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Office Hours
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  question: "How do I enroll in a course?",
                  answer: "You can browse our courses and enroll directly online. Simply select your desired course, complete the registration form, and make payment to secure your spot."
                },
                {
                  question: "Do you offer financial aid or scholarships?",
                  answer: "Yes, we offer various financial aid options and scholarships for eligible students. Contact our admissions team for more information about available programs."
                },
                {
                  question: "What is the class schedule like?",
                  answer: "Our courses offer flexible scheduling with both full-time and part-time options. Most courses include live sessions, recorded lectures, and hands-on projects."
                },
                {
                  question: "Do you provide job placement assistance?",
                  answer: "Absolutely! We have a dedicated career services team that helps students with resume building, interview preparation, and job placement assistance."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
