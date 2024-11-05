import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { BaseUrl } from './Util/util';

const DonorResponseHospitalAdmin = () => {
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState('');

    const location = useLocation(); // Get the location object from react-router-dom

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("adminToken");
            const queryParams = new URLSearchParams(location.search);
            const requestId = queryParams.get('requestId');
    
            try {
                const response = await axios.get(`${BaseUrl}/getHospitalDonorsResponsesAdmin`, {
                    params: { requestId: requestId },
                    headers: { Authorization: token }  // Use token directly without Bearer
                });
    
                setResponses(response.data.donorsResponse);  // Set the responses in the state
                console.log("Donor response in admin hospital =>", response);
            } catch (error) {
                console.error('Request failed:', error);
                setError('Failed to fetch donor responses. Please try again.');
            }
        };
    
        fetchData();
    }, []);  // Empty dependency array ensures this effect runs only on mount
    
    return (
        <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center">
          <Link
            to="/admin"
            className="text-lg mb-4 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition duration-300 ease-in-out"
          >
            Admin Home
          </Link>
        </div>
        
        <hr className="border-t-2 border-red-300 my-6" />
      
        <h2 className="text-2xl font-semibold text-center text-red-700">Donor Responses Admin</h2>
      
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      
        {responses.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {responses.map((response, index) => (
              <li
                key={index}
                className="p-4 bg-gray-100 border border-gray-300 rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-gray-200"
              >
                <p className="text-lg text-gray-800">
                  <span className="font-semibold">Donor ID:</span> {response.donorId}
                </p>
                <p className="text-lg text-gray-800">
                  <span className="font-semibold">Phone Number:</span> {response.phoneNumber}
                </p>
                <p className="text-lg text-gray-800">
                  <span className="font-semibold">Blood Group:</span> {response.bloodGroup}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-6">No responses available</p>
        )}
      </div>
      
    );
};

export default DonorResponseHospitalAdmin;
