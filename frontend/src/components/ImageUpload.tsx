import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ImageUpload: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validImages = selectedFiles.filter(file => file.type.startsWith('image/'));

      if (validImages.length !== selectedFiles.length) {
        setError('Only image files (e.g., JPG, PNG) are allowed.');
      } else {
        setError('');
      }

      setImages(validImages);
    }
  };

  const handleTitleChange = (index: number, title: string) => {
    const newTitles = [...titles];
    newTitles[index] = title;
    setTitles(newTitles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please select at least one image to upload.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
      formData.append('titles', titles[index] || '');
    });

    try {
      const response = await axios.post('/api/image/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });


      console.log("response upload : " , response);

      if(response.data.success){
        toast.success(response.data.message);
        navigate('/dashboard');
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
   <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 relative'>


<motion.form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl font-extrabold text-center text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        Upload Your Awesome Images
      </motion.h2>

      {error && (
        <motion.p
          className="text-red-500 text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      <motion.input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesChange}
        className="mb-6 w-full border border-gray-300 rounded-md p-3 cursor-pointer hover:border-indigo-400"
        whileHover={{ scale: 1.02 }}
      />

      <AnimatePresence>
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={URL.createObjectURL(image)}
              alt={`preview ${index}`}
              className="h-40 w-full object-cover rounded-md mb-2 border"
            />
            <input
              type="text"
              placeholder="Enter Image Title"
              value={titles[index] || ''}
              onChange={(e) => handleTitleChange(index, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        type="submit"
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium py-3 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Upload Images
      </motion.button>
    </motion.form>

   </div>
  );
};

export default ImageUpload;
