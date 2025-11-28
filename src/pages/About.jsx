import { motion } from 'framer-motion'
import { Target, Eye, Users, Award, BookOpen, Globe } from 'lucide-react'
import LazyImage from '../components/LazyImage'
import InstructorHero1 from '../assets/images/instructor-hero-1.jpg'
import InstructorHero2 from '../assets/images/instructor-hero-2.jpg'

const About = () => {
  const values = [
    {
      icon: BookOpen,
      title: 'Excellence in Education',
      description: 'We maintain the highest standards in curriculum design and delivery, ensuring our students receive world-class education.'
    },
    {
      icon: Users,
      title: 'Student-Centered Approach',
      description: 'Every decision we make is focused on student success, providing personalized learning experiences and support.'
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'Our programs prepare students for the global marketplace with internationally recognized skills and certifications.'
    },
    {
      icon: Award,
      title: 'Industry Relevance',
      description: 'We work closely with industry leaders to ensure our curriculum reflects current market demands and trends.'
    }
  ]

  const team = [
    {
      name: 'Sheikh Ishtiaq',
      role: 'Senior Instructor',
      image: InstructorHero1,
      bio: 'Expert in personal development and media production with over 10 years of experience.',
      courses: ['Personal Grooming', 'Video Editing', 'Neurosmetic']
    },
    {
      name: 'Hafiz Abdul Manan',
      role: 'Lead Instructor',
      image: InstructorHero2,
      bio: 'Specialist in digital technologies and creative design with 8+ years of teaching experience.',
      courses: ['Graphic Designing', 'Artificial Intelligence (AI)', 'Digital Marketing']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Aglo Academy
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Empowering the next generation with cutting-edge skills and knowledge 
              for a successful future in the digital world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Target className="h-12 w-12 text-primary-600 mr-4" />
                <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To provide accessible, high-quality education that equips students with the 
                practical skills and knowledge needed to thrive in today's rapidly evolving 
                digital landscape. We believe in learning by doing and preparing students 
                for real-world challenges.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Eye className="h-12 w-12 text-primary-600 mr-4" />
                <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be the leading educational institution that bridges the gap between 
                traditional education and industry requirements, creating a generation 
                of skilled professionals who drive innovation and progress in their 
                respective fields.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Aglo Academy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <value.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
            </motion.div>

            <motion.div
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Founded in 2020, Aglo Academy emerged from a simple yet powerful 
                observation: the gap between traditional education and the rapidly evolving 
                demands of the modern workplace was growing wider every day.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our founders, a group of industry veterans and education experts, recognized 
                that students needed more than theoretical knowledge—they needed practical, 
                hands-on experience with the tools and technologies that drive today's economy.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we've grown from a small startup to a comprehensive educational 
                institution, having trained over 2,000 students across various disciplines. 
                Our success is measured not just in numbers, but in the career transformations 
                and success stories of our graduates who are now leading innovation in 
                companies worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-primary-50 px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals who guide our mission
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-6 -mt-16">
                  <div className="relative">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
                      <LazyImage
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full rounded-lg"
                        width="100%"
                        height="100%"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary-600">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Become part of a learning community that's shaping the future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Both buttons use btn-primary */}
              <a href="/courses" className="btn-primary">
                Explore Courses
              </a>
              <a href="/contact" className="btn-primary">
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
