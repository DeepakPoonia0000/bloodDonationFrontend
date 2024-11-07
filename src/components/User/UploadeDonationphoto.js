import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../Util/util';
import { toast } from 'react-toastify';

const UploadeDonationPhoto = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token')

    // Function to get signature from backend and upload image to Cloudinary
    const handleImageUpload = async () => {
        if (!image) {
            alert("Please upload an image");
            return;
        }

        setLoading(true);

        try {
            // Step 1: Get signature from backend
            const signatureResponse = await axios.get(`${BaseUrl}/usersignature`, {
                headers: {
                    authorization: token
                }
            }
            );


            // Step 2: Prepare form data for Cloudinary upload
            const {signature,timestamp} = signatureResponse.data;
            const formData = new FormData();
            formData.append('file', image);
            formData.append('timestamp', timestamp);
            formData.append('api_key', '818293888972625');
            formData.append('signature', signature);
            // formData.append('folder', 'donationImages');

            // Step 3: Upload to Cloudinary
            const cloudinaryResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/dyhoapc9t/image/upload`,
                formData
            );
            const uploadedImageUrl = cloudinaryResponse.data.secure_url;
            console.log(cloudinaryResponse)

            const updateResponse = await axios.post(`${BaseUrl}/uploadUserImage`,{
                imageUrl: uploadedImageUrl
            },{
                headers: {
                    authorization:token,
                },
            }).then(()=>{
                toast.success("images uploaded successfully");
                setImage(null);
            }).catch((err)=> {
                console.log(err);
                toast.error("Error uploading image");
            })        
        } catch (error) {
            console.error("Error uploading the image:", error);
            alert("Image upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Donation Photo</h1>

            <div className="mb-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            <button
                onClick={handleImageUpload}
                disabled={loading}
                className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {loading ? "Uploading..." : "Upload Photo"}
            </button>
        </div>

    );
};

export default UploadeDonationPhoto;
