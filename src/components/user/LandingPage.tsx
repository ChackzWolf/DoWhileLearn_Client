import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, Play, Brain, Clock, ChevronRight, Laptop } from 'lucide-react';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { icon: <BookOpen size={32} />, title: "1000+ Courses", description: "Access a vast library of expert-led courses" },
    { icon: <Award size={32} />, title: "Certificates", description: "Earn recognized certificates upon completion" },
    { icon: <Users size={32} />, title: "Expert Teachers", description: "Learn from industry professionals" }
  ];

  const courses = [
    { title: "Web Development", students: "15K+", duration: "20 weeks", level: "Beginner" },
    { title: "Data Science", students: "12K+", duration: "16 weeks", level: "Intermediate" },
    { title: "UI/UX Design", students: "8K+", duration: "12 weeks", level: "All Levels" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-violet-600 to-violet-900">
      {/* Header */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-2xl font-bold text-white flex items-center gap-2"
          >
            <Brain className="text-white" />
            LearnWise
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            {['Courses', 'Teachers', 'Pricing', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                href="#"
                className="text-white hover:text-violet-200 transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Transform Your Future With Online Learning
            </motion.h1>
            <motion.p 
              className="mt-6 text-lg text-violet-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Access world-class education from anywhere. Learn at your own pace and build your future with our interactive courses.
            </motion.p>
            <motion.div 
              className="mt-8 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-violet-900 rounded-full font-bold hover:bg-violet-100 transition-colors flex items-center gap-2"
              >
                Start Learning <ChevronRight size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-violet-800 text-white rounded-full font-bold hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                Watch Demo <Play size={20} />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt="Learning Platform" 
                className="rounded-lg shadow-xl"
              />
              <motion.div 
                className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <Users className="text-violet-600" />
                  <span className="font-bold text-violet-900">50K+ Students</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3  gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 text-white cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  className="mb-4"
                  animate={{ rotate: activeFeature === index ? 360 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-violet-100">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Courses */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Popular Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-6 text-violet-900 cursor-pointer"
            >
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold">{course.title}</h3>
                <div className="flex items-center gap-2 text-violet-600">
                  <Users size={16} />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-2 text-violet-600">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-violet-600">
                  <Laptop size={16} />
                  <span>{course.level}</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-3 bg-violet-600 text-white rounded-full font-bold hover:bg-violet-700 transition-colors"
                >
                  Enroll Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;