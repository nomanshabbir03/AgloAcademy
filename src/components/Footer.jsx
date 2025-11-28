import { motion } from 'framer-motion'
import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'

// TikTok Icon Component
const TikTok = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-dark text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Academy Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary-accent" />
              <span className="text-xl font-heading font-bold">Aglo Academy</span>
            </div>
            <p className="text-primary-secondary mb-4 font-body">
              Empowering the next generation with cutting-edge skills and knowledge 
              for a successful future in the digital world.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/1DbnEoGtjk/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-secondary hover:text-primary-accent transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/myagloacademy?igsh=MWZvZ3I4c3poZXc2Yg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-secondary hover:text-primary-accent transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-secondary hover:text-primary-accent transition-colors"
                aria-label="Visit our YouTube channel"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="#" 
                className="text-primary-secondary hover:text-primary-accent transition-colors"
                aria-label="Visit our LinkedIn page"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/@myagloacademy?_r=1&_t=ZS-91mXOOhYRQz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-secondary hover:text-primary-accent transition-colors"
                aria-label="Visit our TikTok page"
              >
                <TikTok size={20} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">Home</a></li>
              <li><a href="/courses" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">Courses</a></li>
              <li><a href="/about" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">About Us</a></li>
              <li><a href="/contact" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">Contact</a></li>
            </ul>
          </motion.div>

          {/* Popular Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-heading font-semibold mb-4">Our Courses</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">Artificial Intelligence (AI)</a></li>
              <li><a href="#" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">Digital Marketing</a></li>
              <li><a href="#" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">Graphic Designing</a></li>
              <li><a href="#" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">Video Editing</a></li>
              <li><a href="#" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">Personal Grooming</a></li>
              <li><a href="#" className="text-primary-secondary hover:text-primary-accent transition-colors font-body">Neurosmetic</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-heading font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-primary-accent" />
                <span className="text-primary-secondary font-body">45 A, E11 Islamabad Pakistan</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary-accent" />
                <span className="text-primary-secondary font-body">+92 3365116800</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary-accent" />
                <span className="text-primary-secondary font-body">+92 3061380308</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary-accent" />
                <span className="text-primary-secondary font-body">myagloacademy@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-primary-secondary/30 mt-8 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-primary-secondary font-body">
            © {currentYear} Aglo Academy. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
