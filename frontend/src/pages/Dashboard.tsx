import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageList from '../components/ImageList';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Key, Upload, Image, Grid, List, Search } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout }: any = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden"
    >


     


      <div className="max-w-7xl mx-auto ">
        <motion.div 
          variants={itemVariants}
          className="flex flex-col mt-8 md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center mb-4 mx-32 md:mb-0">
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="mr-3"
            >
              <Image size={36} className="text-indigo-600" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Image Dashboard
              </h1>
              <p className="text-gray-500">Manage your premium stock images</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <motion.div 
                animate={isSearchFocused ? { width: '200px' } : { width: '200px' }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative"
              >
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </motion.div>
            </div>
            
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`flex items-center p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} className={viewMode === 'grid' ? 'text-indigo-600' : 'text-gray-500'} />
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`flex items-center p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} className={viewMode === 'list' ? 'text-indigo-600' : 'text-gray-500'} />
              </motion.button>
            </div>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md"
            >
              <Upload size={18} />
              <span>Upload</span>
            </motion.button>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate('/Change-password')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-md"
            >
              <Key size={18} />
              <span>Password</span>
            </motion.button>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg shadow-md"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <ImageList viewMode={viewMode} searchTerm={searchTerm} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;