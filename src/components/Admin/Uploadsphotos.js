import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../Util/util';
import UploadBanner from './UploadBanneer';

const UpdateMediaComponent = () => {
  const [selectedSection, setSelectedSection] = useState('sectionOne');
  const [selectedImageNumber, setSelectedImageNumber] = useState('imageOne');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideoNumber, setSelectedVideoNumber] = useState('videoOne');
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // State for tracking upload status
  const token = localStorage.getItem('adminToken');


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleVideoFileChange = (event) => {
    setSelectedVideoFile(event.target.files[0]);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleImageNumberChange = (event) => {
    setSelectedImageNumber(event.target.value);
  };

  const handleVideoNumberChange = (event) => {
    setSelectedVideoNumber(event.target.value);
  };

  const handleUpload = async () => {
    console.log(token);
    if (!selectedFile) {
      alert('Please select an image to upload');
      return;
    }

    setIsUploading(true); // Set uploading state to true

    try {
      const signatureResponse = await axios.get(`${BaseUrl}/signature`,{
        headers:{
          authorization:token
        }}
      );
      const { signature, timestamp } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', '818293888972625');
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dyhoapc9t/image/upload`,
        formData
      );

      const imageUrl = cloudinaryResponse.data.secure_url;

      const updateResponse = await axios.put(`${BaseUrl}/updateImage`, {
        section: selectedSection,
        imageNumber: selectedImageNumber,
        imageUrl,
      },
        {
          headers: {
            authorization: token,
          },
        }
      );

      if (updateResponse.status === 200) {
        alert('Image uploaded and updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading or updating image:', error);
      alert('Error uploading or updating image');
    } finally {
      setIsUploading(false); // Reset uploading state after completion
    }
  };

  const handleVideoUpload = async () => {
    console.log(token);

    if (!selectedVideoFile) {
      alert('Please select a video to upload');
      return;
    }

    setIsUploading(true); // Set uploading state to true
    try {
      const signatureResponse = await axios.get(`${BaseUrl}/signature`,
        {
          headers: {
            authorization: token,
          },
        }
      )
      const { signature, timestamp } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', selectedVideoFile);
      formData.append('api_key', '818293888972625');
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dyhoapc9t/video/upload`,
        formData
      );
      console.log(cloudinaryResponse);
      const imageUrl = cloudinaryResponse.data.secure_url;
      const updateResponse = await axios.put(`${BaseUrl}/updateImage`, {
        section: selectedSection,
        imageNumber: selectedVideoNumber,
        imageUrl,
      },
        {
          headers: {
            authorization: token,
          },
        }
      );

      if (updateResponse.status === 200) {
        alert('Video uploaded and updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading or updating video:', error);
      alert('Error uploading or updating video');
    } finally {
      setIsUploading(false); // Reset uploading state after completion
    }
  };

  return (
    <>
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Update Media Section</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Select Section:</label>
        <select
          value={selectedSection}
          onChange={handleSectionChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="sectionOne">Section One</option>
          <option value="sectionTwo">Section Two</option>
          <option value="sectionThree">Section Three</option>
          <option value="sectionFour">Section Four</option>
          <option value="sectionFive">Section Five (Video Upload)</option>
        </select>
      </div>

      {selectedSection !== 'sectionFive' ? (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Select Image Number:</label>
            <select
              value={selectedImageNumber}
              onChange={handleImageNumberChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="imageOne">Image One</option>
              <option value="imageTwo">Image Two</option>
              <option value="imageThree">Image Three</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Upload Image:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-gray-500 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading} // Disable the button during upload
            className={`w-full py-2 rounded-md transition ${isUploading
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-500'
              }`}
          >
            {isUploading ? 'Uploading...' : 'Upload and Update Image'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Select Video Number:</label>
            <select
              value={selectedVideoNumber}
              onChange={handleVideoNumberChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="videoOne">Video One</option>
              <option value="videoTwo">Video Two</option>
              <option value="videoThree">Video Three</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Upload Video:</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              className="mt-1 block w-full text-gray-500 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={handleVideoUpload}
            disabled={isUploading} // Disable the button during upload
            className={`w-full py-2 rounded-md transition ${isUploading
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
          >
            {isUploading ? 'Uploading...' : 'Upload and Update Video'}
          </button>
        </>
      )}
    </div>
    <UploadBanner/>
    </>
  );
};

export default UpdateMediaComponent;
