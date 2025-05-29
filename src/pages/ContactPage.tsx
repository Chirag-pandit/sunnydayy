import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      // Reset form after success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-pattern bg-cover bg-center py-20">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-primary mb-4 uppercase">
              GET IN TOUCH
            </h1>
            <p className="text-xl text-gray-100 mb-6">
              Have questions about our products? Want to become a partner? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-16 bg-secondary-dark">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Method 1 */}
            <motion.div 
              className="bg-secondary p-6 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <Phone size={28} className="text-secondary-dark" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Call Us</h3>
              <p className="text-gray-300 mb-4">
                Mon-Fri from 9am to 6pm EST
              </p>
              <a href="tel:+18885551234" className="text-primary hover:text-primary-dark text-lg font-medium transition-colors">
                +1 (888) 555-FIGHT
              </a>
            </motion.div>
            
            {/* Contact Method 2 */}
            <motion.div 
              className="bg-secondary p-6 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-secondary-dark" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Email Us</h3>
              <p className="text-gray-300 mb-4">
                We'll respond within 24 hours
              </p>
              <a href="mailto:info@sunnydaymma.com" className="text-primary hover:text-primary-dark text-lg font-medium transition-colors">
                info@sunnydaymma.com
              </a>
            </motion.div>
            
            {/* Contact Method 3 */}
            <motion.div 
              className="bg-secondary p-6 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} className="text-secondary-dark" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Visit Us</h3>
              <p className="text-gray-300 mb-4">
                Our showroom is open to the public
              </p>
              <address className="text-primary not-italic text-lg font-medium">
                123 Fighter Street<br />
                Octagon City, CA 90210
              </address>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Contact Form & Map */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <motion.div 
              className="lg:w-1/2"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-6">
                SEND US A <span className="text-primary">MESSAGE</span>
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-200 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input w-full"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-200 mb-2">Your Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input w-full"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-200 mb-2">Subject</label>
                  <select 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input w-full"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="order-status">Order Status</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-200 mb-2">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input w-full"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <button 
                    type="submit" 
                    className="btn-primary flex items-center"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-secondary-dark\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        SENDING...
                      </>
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        SEND MESSAGE
                      </>
                    )}
                  </button>
                  
                  {formStatus === 'success' && (
                    <span className="ml-4 text-green-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Message sent successfully!
                    </span>
                  )}
                  
                  {formStatus === 'error' && (
                    <span className="ml-4 text-red-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Something went wrong. Please try again.
                    </span>
                  )}
                </div>
              </form>
            </motion.div>
            
            {/* Map & Info */}
            <motion.div 
              className="lg:w-1/2"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="section-title mb-6">
                FIND <span className="text-primary">US</span>
              </h2>
              
              {/* Map */}
              <div className="bg-secondary-light rounded-lg overflow-hidden h-72 mb-8">
                <div className="h-full w-full bg-secondary-dark flex items-center justify-center">
                  {/* This would be replaced with an actual map */}
                  <div className="text-center">
                    <MapPin size={48} className="text-primary mx-auto mb-4" />
                    <p className="text-gray-300 text-lg">
                      123 Fighter Street, Octagon City, CA 90210
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary-light p-5 rounded-lg">
                  <div className="flex items-start">
                    <Clock size={24} className="text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-heading font-bold text-lg mb-2">Business Hours</h3>
                      <ul className="space-y-1 text-gray-300">
                        <li className="flex justify-between">
                          <span>Monday - Friday:</span>
                          <span>9am - 6pm</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Saturday:</span>
                          <span>10am - 4pm</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sunday:</span>
                          <span>Closed</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary-light p-5 rounded-lg">
                  <div className="flex items-start">
                    <MessageSquare size={24} className="text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-heading font-bold text-lg mb-2">Customer Support</h3>
                      <p className="text-gray-300 mb-2">
                        For quick responses to common questions, check our FAQ page.
                      </p>
                      <a href="/faq" className="text-primary hover:text-primary-dark transition-colors">
                        View FAQs
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-secondary-dark">
        <div className="container">
          <motion.h2 
            className="section-title text-center mb-12"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
          </motion.h2>
          
          <div className="max-w-3xl mx-auto">
            {/* FAQ Item 1 */}
            <motion.div 
              className="mb-6"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-secondary p-5 rounded-lg">
                <h3 className="font-heading font-bold text-xl mb-3">What are your shipping times?</h3>
                <p className="text-gray-300">
                  Standard shipping typically takes 3-5 business days within the continental US. Expedited shipping options are available at checkout. International shipping times vary by location and typically take 7-14 business days.
                </p>
              </div>
            </motion.div>
            
            {/* FAQ Item 2 */}
            <motion.div 
              className="mb-6"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-secondary p-5 rounded-lg">
                <h3 className="font-heading font-bold text-xl mb-3">What is your return policy?</h3>
                <p className="text-gray-300">
                  We offer a 30-day return policy for unused items in original packaging. Return shipping is free for US customers. Please contact our customer service team to initiate a return or exchange.
                </p>
              </div>
            </motion.div>
            
            {/* FAQ Item 3 */}
            <motion.div 
              className="mb-6"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-secondary p-5 rounded-lg">
                <h3 className="font-heading font-bold text-xl mb-3">Do you offer wholesale or bulk discounts?</h3>
                <p className="text-gray-300">
                  Yes, we offer wholesale pricing for gyms, trainers, and retailers. We also provide volume discounts for large orders. Please contact our sales team at wholesale@sunnydaymma.com for more information.
                </p>
              </div>
            </motion.div>
            
            {/* FAQ Item 4 */}
            <motion.div 
              className="mb-6"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-secondary p-5 rounded-lg">
                <h3 className="font-heading font-bold text-xl mb-3">How do I find the right size?</h3>
                <p className="text-gray-300">
                  We provide detailed size guides for each product category on their respective pages. If you're between sizes, we generally recommend sizing up for a more comfortable fit. For specific questions, our customer service team is happy to help.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center mt-8"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <a href="/faq" className="btn-secondary">
                VIEW ALL FAQs
              </a>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-secondary-dark">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold mb-4"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              STAY UPDATED WITH SUNNYDAY NEWS
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-8"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Subscribe to our newsletter for product updates, exclusive offers, and fighting tips.
            </motion.p>
            
            <motion.form 
              className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-md focus:outline-none"
              />
              <button className="btn bg-secondary-dark text-primary hover:bg-secondary hover:text-primary-light transition-colors">
                SUBSCRIBE
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;