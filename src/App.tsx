import React from 'react';
import DataTable from './components/DataTable';
import { motion } from 'framer-motion';

function App() {
  return (
    <motion.div
      className="min-h-screen text-teal-900 p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 z-0 animate-gradient bg-[conic-gradient(at_top_left,_#2c3e50,_#4ca1af,_#2c3e50)] opacity-30"></div>

      <div className="relative z-10">
        <header className="mb-8 flex items-center justify-between">
          <motion.h1
            className="text-4xl font-extrabold text-teal-100 drop-shadow-lg"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            React's Project
          </motion.h1>

          <motion.div
            className="flex items-center gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <a
              href="https://my-portfolio-himanshu-vermas-projects-3372ad27.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-lg focus:outline-none"
            >
              Profile
            </a>
          </motion.div>
        </header>

        <main className="flex flex-col gap-6">
          <DataTable />
        </main>

        {/* Footer */}
        <motion.footer
          className="mt-12 text-center text-sm text-teal-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p>Created by Himanshu Verma | All rights reserved</p>
        </motion.footer>
      </div>

      {/* Add animation CSS */}
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
          }
        `}
      </style>
    </motion.div>
  );
}

export default App;
