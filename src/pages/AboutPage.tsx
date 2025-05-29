import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Trophy, Users, Shield } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const AboutPage: React.FC = () => {
  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="relative bg-hero-pattern bg-cover bg-center py-20 md:py-32">
        <div className="container">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-primary mb-4 uppercase">
              OUR STORY
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Crafting premium MMA equipment for fighters who demand excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-secondary-dark">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-6">
                OUR <span className="text-primary">MISSION</span>
              </h2>
              <p className="text-gray-200 mb-6 text-lg">
                At SunnyDay MMA, we believe that every fighter deserves gear that matches their commitment to the sport. Our mission is to provide premium quality fight equipment that enhances performance, increases safety, and helps athletes reach their full potential.
              </p>
              <p className="text-gray-200 mb-6 text-lg">
                Founded by a team of professional fighters and equipment specialists, we understand the needs of MMA athletes at all levels - from beginners to champions. Every product we create undergoes rigorous testing and is built to withstand the toughest training sessions and fights.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="text-primary mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-200">Premium materials for maximum durability</p>
                </div>
                <div className="flex items-start">
                  <Check className="text-primary mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-200">Engineered for optimal performance</p>
                </div>
                <div className="flex items-start">
                  <Check className="text-primary mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-200">Designed by fighters, for fighters</p>
                </div>
                <div className="flex items-start">
                  <Check className="text-primary mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-200">Thoroughly tested in real fight conditions</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-primary/30 rounded-lg blur-md"></div>
                <img 
                  src="https://images.pexels.com/photos/7045479/pexels-photo-7045479.jpeg" 
                  alt="MMA Training" 
                  className="relative rounded-lg w-full h-auto z-10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <motion.h2 
            className="section-title text-center mb-12"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            THE <span className="text-primary">SUNNYDAY</span> STORY
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Timeline Item 1 */}
            <motion.div 
              className="bg-secondary-light p-6 rounded-lg"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-secondary-dark font-heading font-bold text-xl mr-4">
                  1
                </div>
                <h3 className="font-heading font-bold text-xl">The Beginning</h3>
              </div>
              <p className="text-gray-300">
                SunnyDay was founded in 2018 by MMA champion Alex Rivera after he identified a gap in the market for truly premium fight gear. Frustrated with equipment that didn't meet his standards, he assembled a team of fighters and designers to create something better.
              </p>
            </motion.div>
            
            {/* Timeline Item 2 */}
            <motion.div 
              className="bg-secondary-light p-6 rounded-lg"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-secondary-dark font-heading font-bold text-xl mr-4">
                  2
                </div>
                <h3 className="font-heading font-bold text-xl">Growth & Innovation</h3>
              </div>
              <p className="text-gray-300">
                After months of development and testing, our first collection launched to critical acclaim. Word spread quickly among the fighting community, and within a year, SunnyDay gear was being used by top competitors around the world.
              </p>
            </motion.div>
            
            {/* Timeline Item 3 */}
            <motion.div 
              className="bg-secondary-light p-6 rounded-lg"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-secondary-dark font-heading font-bold text-xl mr-4">
                  3
                </div>
                <h3 className="font-heading font-bold text-xl">Today & Beyond</h3>
              </div>
              <p className="text-gray-300">
                Today, SunnyDay is recognized as a leader in premium MMA equipment. We continue to innovate and expand our product line, working closely with professional fighters to ensure our gear meets the evolving needs of the sport.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="text-center"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              From our humble beginnings to becoming a trusted name in the MMA world, our commitment to quality has never wavered. We're proud to support fighters at all levels with gear that helps them perform at their best.
            </p>
            <Link to="/products" className="btn-primary">
              EXPLORE OUR PRODUCTS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-secondary-dark">
        <div className="container">
          <motion.h2 
            className="section-title text-center mb-12"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            OUR CORE <span className="text-primary">VALUES</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <motion.div 
              className="bg-secondary-light p-6 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <Trophy size={32} className="text-secondary-dark" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">EXCELLENCE</h3>
              <p className="text-gray-300">
                We're committed to excellence in everything we do, from product design and material selection to customer service.
              </p>
            </motion.div>
            
            {/* Value 2 */}
            <motion.div 
              className="bg-secondary-light p-6 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-secondary-dark" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">INTEGRITY</h3>
              <p className="text-gray-300">
                We operate with honesty and transparency, standing behind every product we create with our quality guarantee.
              </p>
            </motion.div>
            
            {/* Value 3 */}
            <motion.div 
              className="bg-secondary-light p-6 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-secondary-dark" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">COMMUNITY</h3>
              <p className="text-gray-300">
                We're proud to support the MMA community through sponsorships, events, and initiatives that grow the sport.
              </p>
            </motion.div>
            
            {/* Value 4 */}
            <motion.div 
              className="bg-secondary-light p-6 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">INNOVATION</h3>
              <p className="text-gray-300">
                We continuously innovate and improve our products, incorporating feedback from athletes and advances in materials science.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <motion.h2 
            className="section-title text-center mb-4"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            MEET THE <span className="text-primary">TEAM</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Our diverse team combines experience from professional fighting, product design, and sports equipment manufacturing.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <motion.div 
              className="bg-secondary-light rounded-lg overflow-hidden"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg" 
                  alt="Alex Rivera - Founder & CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-heading font-bold text-xl mb-1">Alex Rivera</h3>
                <p className="text-primary mb-2">Founder & CEO</p>
                <p className="text-gray-300 text-sm">
                  Former MMA champion with 15+ years of experience in the sport. Visionary behind SunnyDay's creation.
                </p>
              </div>
            </motion.div>
            
            {/* Team Member 2 */}
            <motion.div 
              className="bg-secondary-light rounded-lg overflow-hidden"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/4498152/pexels-photo-4498152.jpeg" 
                  alt="Sarah Chen - Head of Design" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-heading font-bold text-xl mb-1">Sarah Chen</h3>
                <p className="text-primary mb-2">Head of Design</p>
                <p className="text-gray-300 text-sm">
                  Product design expert with a background in athletic equipment development for major sports brands.
                </p>
              </div>
            </motion.div>
            
            {/* Team Member 3 */}
            <motion.div 
              className="bg-secondary-light rounded-lg overflow-hidden"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/7148482/pexels-photo-7148482.jpeg" 
                  alt="Marcus Johnson - Technical Director" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-heading font-bold text-xl mb-1">Marcus Johnson</h3>
                <p className="text-primary mb-2">Technical Director</p>
                <p className="text-gray-300 text-sm">
                  Materials engineer with expertise in developing high-performance fabrics and protective equipment.
                </p>
              </div>
            </motion.div>
            
            {/* Team Member 4 */}
            <motion.div 
              className="bg-secondary-light rounded-lg overflow-hidden"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/7148442/pexels-photo-7148442.jpeg" 
                  alt="Elena Petrova - Athlete Relations" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-heading font-bold text-xl mb-1">Elena Petrova</h3>
                <p className="text-primary mb-2">Athlete Relations</p>
                <p className="text-gray-300 text-sm">
                  Former professional fighter and coach who manages our athlete sponsorships and testing program.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsors and Partners */}
      <section className="py-16 bg-secondary-dark">
        <div className="container">
          <motion.h2 
            className="section-title text-center mb-12"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            OUR <span className="text-primary">PARTNERS</span>
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Partner logos would go here - using placeholders */}
            <motion.div 
              className="bg-secondary-light h-32 rounded-lg flex items-center justify-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-xl font-heading text-gray-400">FIGHT LEAGUE</span>
            </motion.div>
            
            <motion.div 
              className="bg-secondary-light h-32 rounded-lg flex items-center justify-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xl font-heading text-gray-400">OCTAGON GYM</span>
            </motion.div>
            
            <motion.div 
              className="bg-secondary-light h-32 rounded-lg flex items-center justify-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xl font-heading text-gray-400">FIGHTER'S CHOICE</span>
            </motion.div>
            
            <motion.div 
              className="bg-secondary-light h-32 rounded-lg flex items-center justify-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-xl font-heading text-gray-400">CHAMPION SERIES</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-secondary-dark">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="mb-6 md:mb-0 text-center md:text-left"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                READY TO ELEVATE YOUR FIGHT GAME?
              </h2>
              <p className="text-xl">
                Join thousands of fighters who trust SunnyDay gear for their training and competitions.
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/products" className="btn bg-secondary-dark text-primary hover:bg-secondary hover:text-primary transition-colors">
                SHOP NOW
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;