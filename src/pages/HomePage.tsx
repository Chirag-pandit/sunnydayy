import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, ShieldCheck, Truck, Instagram } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import { AppleCardsCarouselDemo } from '@/components/AppleCardsCarouseDemo';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductSection from '../components/ProductSection';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-hero-pattern bg-cover bg-center py-20 md:py-32">
        <div className="container">
          <div className="max-w-2xl">
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-primary mb-4 uppercase"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              GEAR UP<br />TO DOMINATE
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Premium MMA fight gear designed for champions. Elevate your performance with SunnyDay equipment.
            </motion.p>
              
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/products" className="btn-primary shine-effect">
                SHOP NOW
              </Link>
              <Link to="/about" className="btn-secondary">
                OUR STORY
              </Link>

              
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-secondary-dark">
        <div className="container">
          <motion.h2 
            className="section-title text-center mb-12"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <span className="text-primary">FIGHT</span> READY GEAR
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category 1 - MMA Gloves */}
            <motion.div 
              className="group relative overflow-hidden rounded-lg"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="h-96 overflow-hidden">
                <img 
                  src="public\images\products\tshirts\Picsart_25-05-01_10-00-19-353.jpg" 
                  alt="MMA T-Shirt" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-heading font-bold text-primary mb-2">MMA T-Shirt</h3>
                <p className="text-gray-100 mb-4">Precision-engineered for perfect strikes.</p>
                <Link to="/products?category=gloves" className="inline-flex items-center text-primary font-heading hover:text-primary-light transition-colors">
                  SHOP T-Shirt <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>

            {/* Category 2 - Fight Shorts */}
            <motion.div 
              className="group relative overflow-hidden rounded-lg"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-96 overflow-hidden">
                <img 
                  src="public\images\products\tshirts\Picsart_25-05-31_14-52-53-537.jpg" 
                  alt="FIGHTERS SHORTS" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-heading font-bold text-primary mb-2">MMA SHORTS</h3>
                <p className="text-gray-100 mb-4">Ultimate flexibility for your toughest moves.</p>
                <Link to="/products?category=shorts" className="inline-flex items-center text-primary font-heading hover:text-primary-light transition-colors">
                  SHOP SHORTS <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>

            {/* Category 3 - Rashguards */}
            <motion.div 
              className="group relative overflow-hidden rounded-lg"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="h-96 overflow-hidden">
                <img 
                  src="public\images\products\tshirts\insomia_hoddie.webp" 
                  alt="MMA HOODIES" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-heading font-bold text-primary mb-2">MMA HOODIE</h3>
                <p className="text-gray-100 mb-4">Superior protection during intense training.</p>
                <Link to="/products?category=rashguards" className="inline-flex items-center text-primary font-heading hover:text-primary-light transition-colors">
                  SHOP HOODIE <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <ProductSection/>

      {/* Featured Product */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title mb-6">
                LATEST <span className="text-primary">RELEASE</span>
              </h2>
              <div className="octagon-clip bg-primary p-1 mb-8 max-w-xs">
                <div className="octagon-clip bg-secondary p-4 text-center">
                  <span className="font-heading text-2xl text-primary">LIMITED EDITION</span>
                </div>
              </div>
              <h3 className="text-3xl font-heading font-bold mb-4">CHAMPIONSHIP GLOVES</h3>
              <p className="text-gray-200 mb-6 max-w-lg">
                Introducing our premium championship-grade MMA gloves, crafted with genuine leather and advanced impact protection. Designed for professional fighters who demand the best.
              </p>
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-3xl font-heading text-primary">$129.99</span>
                <span className="text-xl text-gray-400 line-through">$159.99</span>
              </div>
              <Link to="/products/championship-gloves" className="btn-primary shine-effect">
                SHOP NOW
              </Link>
            </motion.div>

            <motion.div 
              className="md:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-primary rounded-full blur-md opacity-70 animate-pulse-slow"></div>
                <div className="relative bg-secondary-dark rounded-full p-8">
                  <img 
                    src="public\images\products\tshirts\Gloves.jpg" 
                    alt="Championship MMA Gloves" 
                    className="rounded-full w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits/Features */}
      <section className="py-16 bg-texture bg-cover">
        <div className="container">
          <div className="text-center mb-12">
            <motion.h2 
              className="section-title"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              WHY CHOOSE <span className="text-primary">SUNNYDAY</span>
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <motion.div 
              className="bg-secondary-dark p-8 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} className="text-secondary-dark" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4">PREMIUM QUALITY</h3>
              <p className="text-gray-300">
                We use only the highest quality materials to ensure our gear can withstand the toughest fights and training sessions.
              </p>
            </motion.div>
            
            {/* Benefit 2 */}
            <motion.div 
              className="bg-secondary-dark p-8 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Truck size={32} className="text-secondary-dark" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4">FAST SHIPPING</h3>
              <p className="text-gray-300">
                Get your gear quickly with our expedited shipping options. Free shipping on all orders over $100.
              </p>
            </motion.div>
            
            {/* Benefit 3 */}
            <motion.div 
              className="bg-secondary-dark p-8 rounded-lg text-center"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Award size={32} className="text-secondary-dark" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4">FIGHTER TESTED</h3>
              <p className="text-gray-300">
                Developed and tested by professional MMA fighters to ensure performance when it matters most.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary-dark">
        <div className="container">
          <motion.h2 
            className="section-title text-center mb-12"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            FIGHTER <span className="text-primary">TESTIMONIALS</span>
          </motion.h2>


          {/* <AnimatedTestimonials testimonials={testimonials} autoplay={true} /> */}
             <AppleCardsCarouselDemo/>

          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="testimonial-slider"
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3,
                centeredSlides: false,
              },
            }}
          >
            {/* Testimonial 1 */}
            <SwiperSlide>
              <div className="bg-secondary p-8 rounded-lg h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full mr-4">
                    <img 
                      src="https://images.pexels.com/photos/6740056/pexels-photo-6740056.jpeg" 
                      alt="Fighter" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg">Alex "The Destroyer" Thompson</h4>
                    <p className="text-gray-400">UFC Fighter</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "SunnyDay gloves have been a game-changer for my training. The quality and protection they provide is unmatched. I won't use anything else."
                </p>
              </div>
            </SwiperSlide>

            {/* Testimonial 2 */}
            <SwiperSlide>
              <div className="bg-secondary p-8 rounded-lg h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full mr-4">
                    <img 
                      src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg" 
                      alt="Fighter" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg">Sarah "Knockout" Johnson</h4>
                    <p className="text-gray-400">Bellator Champion</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "As a professional fighter, I need gear I can trust. SunnyDay rashguards provide the perfect blend of protection and comfort during my most intense training sessions."
                </p>
              </div>
            </SwiperSlide>

            {/* Testimonial 3 */}
            <SwiperSlide>
              <div className="bg-secondary p-8 rounded-lg h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full mr-4">
                    <img 
                      src="https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg" 
                      alt="Fighter" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg">Mike "The Beast" Rodriguez</h4>
                    <p className="text-gray-400">MMA Coach</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "I recommend SunnyDay gear to all my fighters. The durability is impressive, and they've thought of everything a fighter needs. Top quality products."
                </p>
              </div>
            </SwiperSlide>

            {/* Testimonial 4 */}
            <SwiperSlide>
              <div className="bg-secondary p-8 rounded-lg h-full">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full mr-4">
                    <img 
                      src="https://images.pexels.com/photos/7045664/pexels-photo-7045664.jpeg" 
                      alt="Fighter" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg">Elena "Swift" Martinez</h4>
                    <p className="text-gray-400">BJJ Black Belt</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "The SunnyDay shorts give me the perfect range of motion for grappling. They're comfortable, durable, and look great. Worth every penny."
                </p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* Instagram Gallery / Social Proof */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-4">
              FOLLOW US ON <span className="text-primary">INSTAGRAM</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              @SunnyDayMMA - Tag us in your training photos for a chance to be featured
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Instagram Post 1 */}
            <motion.div 
              className="relative group overflow-hidden"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1708134003412-7a05fe510a5f?q=80&w=1688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="MMA Training" 
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <a href="https://www.instagram.com/sunnydayofficials/" target="_blank" rel="noopener noreferrer">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram size={32} className="text-white" />
                  </div>
              </a>
            </motion.div>
            
            {/* Instagram Post 2 */}
            <motion.div 
              className="relative group overflow-hidden"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img 
                src="https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg" 
                alt="MMA Equipment" 
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <a href="https://www.instagram.com/sunnydayofficials/" target="_blank" rel="noopener noreferrer">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">

                  <Instagram size={32} className="text-white" />
                </div>
              </a>
            </motion.div>
            
            {/* Instagram Post 3 */}
            <motion.div 
              className="relative group overflow-hidden"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <img 
                src="https://images.pexels.com/photos/6635223/pexels-photo-6635223.jpeg" 
                alt="Fighter Training" 
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <a href="https://www.instagram.com/sunnydayofficials/" target="_blank" rel="noopener noreferrer">

              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              
                <Instagram size={32} className="text-white" />
              </div></a>
            </motion.div>
            
            {/* Instagram Post 4 */}
            <motion.div 
              className="relative group overflow-hidden"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <img 
                src="https://images.pexels.com/photos/7991604/pexels-photo-7991604.jpeg" 
                alt="MMA Sparring" 
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <a href="https://www.instagram.com/sunnydayofficials/" target="_blank" rel="noopener noreferrer">

              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram size={32} className="text-white" />
              </div></a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-secondary-dark">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="mb-8 md:mb-0 text-center md:text-left"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">JOIN THE FIGHTERS CLUB</h2>
              <p className="text-xl">Get exclusive offers, new product alerts & training tips</p>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-auto"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-dark"
                />
                <button className="btn bg-secondary text-primary hover:bg-secondary-dark hover:text-primary-light transition-colors">
                  SUBSCRIBE
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;