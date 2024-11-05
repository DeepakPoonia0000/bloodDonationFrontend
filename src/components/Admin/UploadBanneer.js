import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import { BaseUrl } from '../Util/util';

const UploadBanner = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [banner, setBanner] = useState([]);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/getAllBanners`);
        setBanner(response.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
        toast.error('Failed to load banners');
      }
    };
    fetchBanners();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    try {
      const signatureResponse = await axios.get(`${BaseUrl}/signature`, {
        headers: {
          authorization: token,
        },
      });
      const { signature, timestamp } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', '818293888972625'); // Replace with actual Cloudinary API key
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dyhoapc9t/image/upload',
        formData
      );

      return cloudinaryResponse.data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      toast.error('Error uploading image');
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image file.');
      return;
    }

    setLoading(true);
    try {
      setUploadingImage(true);
      const imageUrl = await uploadImageToCloudinary(imageFile);
      setUploadingImage(false);

      const response = await axios.post(
        `${BaseUrl}/createBanner`,
        { title, description, image: imageUrl },
        { headers: { authorization: token } }
      );

      toast.success(response.data.message);
      setTitle('');
      setDescription('');
      setImageFile(null);

      // Fetch the updated banners list
      const bannersResponse = await axios.get(`${BaseUrl}/getAllBanners`);
      setBanner(bannersResponse.data);
    } catch (err) {
      toast.error(err.response ? err.response.data.message : 'Error creating banner');
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    try {
      const response = await axios.delete(`${BaseUrl}/deleteBanner`, 
        {
        params: { bannerId:id },
        headers: { authorization: token },
      });
      toast.success('Banner deleted successfully');

      setBanner((prevBanners) => prevBanners.filter((banner) => banner._id !== id));
    } catch (error) {
      console.error('Error deleting the banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-5">
      <div className="bg-white border border-red-300 rounded-lg p-8 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-5">Upload Banner</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border border-gray-300 rounded-lg w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="border border-gray-300 rounded-lg w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image:</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="border border-gray-300 rounded-lg w-full p-2"
            />
          </div>

          <button
            type="submit"
            className={`mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (uploadingImage ? 'Uploading Image...' : 'Creating Banner...') : 'Create Banner'}
          </button>
        </form>
      </div>

      {/* Show banner section */}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-5">Banners</h2>
        {banner.length > 0 ? (
          banner.map((bannerItem) => (
            <div key={bannerItem._id} className="mb-5 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">{bannerItem.title}</h3>
              <img src={bannerItem.image} alt={bannerItem.description} className="mb-2" />
              <button
                onClick={() => deleteBanner(bannerItem._id)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded-xl"
              >
                Delete Banner
              </button>
            </div>
          ))
        ) : (
          <p>Loading banners...</p>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default UploadBanner;
