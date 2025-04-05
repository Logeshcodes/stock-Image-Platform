import React, { useEffect, useRef, useState, useCallback } from "react";
import Sortable from "sortablejs";
import axios from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, X, Save, RefreshCw, Upload, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Image {
  _id: string;
  title: string;
  imageUrl: string;
  order: number;
}

interface ImageListProps {
  viewMode: 'grid' | 'list';
  searchTerm: string;
}

const ImageList: React.FC<ImageListProps> = ({ viewMode, searchTerm }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const sortableContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const navigate = useNavigate()

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/image/getImage", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedImages = response.data.sort((a: Image, b: Image) => a.order - b.order);
      setImages(sortedImages);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (sortableContainerRef.current && !loading && viewMode === 'grid') {
      Sortable.create(sortableContainerRef.current, {
        animation: 150,
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        onEnd: async (event) => {
          const newImages = Array.from(images);
          const [removed] = newImages.splice(event.oldIndex!, 1);
          newImages.splice(event.newIndex!, 0, removed);

          const updatedImages = newImages.map((image, index) => ({
            ...image,
            order: index,
          }));

          setImages(updatedImages);

          const token = localStorage.getItem("token");
          try {
            await axios.put("/api/image/updateOrder", updatedImages, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (error) {
            console.error("Failed to update image order:", error);
          }
        },
      });
    }
  }, [images, loading, viewMode]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirmDelete !== id) {
        setConfirmDelete(id);
        return;
      }
      
      setDeleting(id);
      try {
        await axios.delete(`/api/image/delete-image/${id}`);
        fetchImages();
      } catch (error) {
        console.error("Failed to delete image:", error);
      } finally {
        setDeleting(null);
        setConfirmDelete(null);
      }
    },
    [fetchImages, confirmDelete]
  );

  const openEditModal = (image: Image) => {
    setCurrentImage(image);
    setEditTitle(image.title);
    setError(null);
    setEditFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setEditFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    if (currentImage) {
      setSaving(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", editTitle);
      if (editFile) {
        formData.append("image", editFile);
      }

      try {
        await axios.put(
          `/api/image/edit/${currentImage._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        await fetchImages();
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to edit image:", error);
        setError("Failed to save changes.");
      } finally {
        setSaving(false);
      }
    }
  };

  const filteredImages = images.filter(image => 
    image.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 25 } 
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  };

  const renderSkeletonLoader = () => {
    return Array(10).fill(0).map((_, index) => (
      <motion.div
        key={`skeleton-${index}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-100 p-4 rounded-xl shadow-md aspect-[3/4] flex flex-col items-center"
      >
        <div className="h-3/4 w-full bg-gray-200 animate-pulse mb-2 rounded-lg"></div>
        <div className="w-full h-8 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
        <div className="flex gap-2 w-full">
          <div className="w-1/2 h-10 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="w-1/2 h-10 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </motion.div>
    ));
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "space-y-4"}>
          {renderSkeletonLoader()}
        </div>
      </div>
    );
  }

  if (filteredImages.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-4 text-gray-400"
        >
          <ImageIcon size={64} />
        </motion.div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No images found</h3>
        <p className="text-gray-500 mb-6">
          {searchTerm ? "Try a different search term or upload new images" : "Upload some images to get started"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>navigate('/upload')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md"
        >
          <Upload size={20} />
          <span>Upload Images</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div>
      {viewMode === 'grid' ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" 
          ref={sortableContainerRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredImages.map((image) => (
              <motion.div
                key={image._id}
                layout
                variants={itemVariants}
                exit="exit"
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                style={{ height: "fit-content" }}
                data-id={image._id}
              >
                <div className="relative group">
                  <img
                    src={`http://localhost:4000${image.imageUrl}`}
                    alt={image.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEditModal(image)}
                      className="mx-2 p-2 bg-white rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                    >
                      <Edit2 size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(image._id)}
                      className={`mx-2 p-2 bg-white rounded-full ${confirmDelete === image._id ? 'text-white bg-red-600' : 'text-red-600 hover:bg-red-600 hover:text-white'} transition-colors duration-300`}
                      disabled={deleting === image._id}
                    >
                      {deleting === image._id ? (
                        <RefreshCw size={20} className="animate-spin" />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </motion.button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 truncate">{image.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Order: {image.order + 1}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredImages.map((image) => (
              <motion.div
                key={image._id}
                variants={itemVariants}
                exit="exit"
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex"
              >
                <img
                  src={`http://localhost:4000${image.imageUrl}`}
                  alt={image.title}
                  className="h-24 w-24 object-cover"
                />
                <div className="p-4 flex-grow flex items-center">
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-800">{image.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Order: {image.order + 1}</p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(image)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(image._id)}
                      className={`p-2 ${confirmDelete === image._id ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'} rounded-lg transition-colors duration-300`}
                      disabled={deleting === image._id}
                    >
                      {deleting === image._id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {isModalOpen && currentImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => !saving && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white p-6 rounded-xl w-full max-w-md mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Edit Image</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => !saving && setIsModalOpen(false)}
                  disabled={saving}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </div>
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-5 overflow-hidden rounded-lg relative group"
              >
                <img
                  src={previewUrl || `http://localhost:4000${currentImage.imageUrl}`}
                  alt={currentImage.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                  <label className="cursor-pointer">
                    <div className="bg-white/90 text-indigo-600 font-medium py-2 px-4 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                      <Upload size={16} />
                      Change Image
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={saving}
                    />
                  </label>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  disabled={saving}
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter image title"
                />
              </motion.div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEditSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => !saving && setIsModalOpen(false)}
                  disabled={saving}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-70"
                >
                  Cancel
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageList;