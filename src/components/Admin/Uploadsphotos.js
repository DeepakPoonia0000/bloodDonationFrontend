import React, { useEffect, useState } from 'react';
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
  const [images, setImages] = useState([]);
  const [activeSection, setActiveSection] = useState(1); // Track the active section


  // Fetch images on component mount
  const getUploadedImages = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/getImages`); // Get uploaded images
      setImages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUploadedImages();
  }, []);

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
      const signatureResponse = await axios.get(`${BaseUrl}/signature`, {
        headers: {
          authorization: token
        }
      }
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
      <div className="container mx-auto p-6">
        <div className="mb-6 text-center">
          {/* Buttons to toggle sections */}
          <button
            className={`px-4 py-2 mx-2 text-white font-semibold rounded ${activeSection === 1 ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setActiveSection(1)}
          >
            Section 1
          </button>
          <button
            className={`px-4 py-2 mx-2 text-white font-semibold rounded ${activeSection === 2 ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setActiveSection(2)}
          >
            Section 2
          </button>
          <button
            className={`px-4 py-2 mx-2 text-white font-semibold rounded ${activeSection === 3 ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setActiveSection(3)}
          >
            Section 3
          </button>
          <button
            className={`px-4 py-2 mx-2 text-white font-semibold rounded ${activeSection === 4 ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setActiveSection(4)}
          >
            Section 4
          </button>
          <button
            className={`px-4 py-2 mx-2 text-white font-semibold rounded ${activeSection === 5 ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setActiveSection(5)}
          >
            Section 5
          </button>
        </div>

        {/* Conditionally render sections based on activeSection */}
        {images.length > 0 ? (
          images.map((imageData, index) => (
            <div key={index} className="space-y-8">
              {/* Section One */}
              {activeSection === 1 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-center">Section One</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {imageData.sectionOne && (
                      <>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image One</h3>
                          <img
                            src={imageData.sectionOne.imageOne}
                            alt="Image One"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image Two</h3>
                          <img
                            src={imageData.sectionOne.imageTwo}
                            alt="Image Two"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Section Two */}
              {activeSection === 2 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-center">Section Two</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {imageData.sectionTwo && (
                      <>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image One</h3>
                          <img
                            src={imageData.sectionTwo.imageOne}
                            alt="Image One"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image Two</h3>
                          <img
                            src={imageData.sectionTwo.imageTwo}
                            alt="Image Two"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image Three</h3>
                          <img
                            src={imageData.sectionTwo.imageThree}
                            alt="Image Three"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Section Three */}
              {activeSection === 3 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-center">Section Three</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {imageData.sectionThree && (
                      <>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image One</h3>
                          <img
                            src={imageData.sectionThree.imageOne}
                            alt="Image One"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image Two</h3>
                          <img
                            src={imageData.sectionThree.imageTwo}
                            alt="Image Two"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image Three</h3>
                          <img
                            src={imageData.sectionThree.imageThree}
                            alt="Image Three"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Section Four */}
              {activeSection === 4 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-center">Section Four</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {imageData.sectionFour && (
                      <>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image One</h3>
                          <img
                            src={imageData.sectionFour.imageOne}
                            alt="Image One"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image Two</h3>
                          <img
                            src={imageData.sectionFour.imageTwo}
                            alt="Image Two"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Image Three</h3>
                          <img
                            src={imageData.sectionFour.imageThree}
                            alt="Image Three"
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Section Five (Videos) */}
              {activeSection === 5 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-center">Section Five (Videos)</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {imageData.sectionFive && (
                      <>
                        <div className="space-y-2 text-center">
                          <h3 className="font-semibold">Video One</h3>
                          <video controls className="w-full h-auto rounded-lg shadow-md">
                            <source src={imageData.sectionFive.videoOne} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
      <UploadBanner />
    </>
  );
};

export default UpdateMediaComponent;
