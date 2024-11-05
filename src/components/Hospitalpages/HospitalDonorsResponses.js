import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BaseUrl } from '../Util/util';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';


const HospitalDonorsResponsesDetails = () => {
  const { requestId } = useParams(); // Fetch the requestId from URL parameters
  const [donorsResponses, setDonorsResponses] = useState(null);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(''); // State for dynamic phone number input
  const location = useLocation();


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const donationId = queryParams.get('userId');
    const fetchDonorsResponses = async () => {
      const token = localStorage.getItem('htoken');

      try {
        const response = await axios.get(`${BaseUrl}/getHospitalDonorsResponses`, {
          params: { requestId: donationId },
          headers: { Authorization: token }
        });
        setDonorsResponses(response.data.donorsResponse);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDonorsResponses();

  }, []);
  const searchbyphonenumber = () => {
    const queryParams = new URLSearchParams(location.search);
    const donationId = queryParams.get('userId');
    const fetchDonorsResponses = async () => {
      const token = localStorage.getItem('htoken');

      try {
        const response = await axios.get(`${BaseUrl}/getHospitalDonorsResponses`, {
          params: { requestId: donationId ,phoneNumber:phoneNumber},
          headers: { Authorization: token }
        });
        setDonorsResponses(response.data.donorsResponse);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchDonorsResponses();
  }


  const bloodReceived = async (donorId) => {
    const queryParams = new URLSearchParams(location.search);
    const donationId = queryParams.get('userId');
    const token = localStorage.getItem('htoken');

    try {
        const response = await axios.post(
            `${BaseUrl}/approveHospitalDonation`,
            { donorId: donorId, donationId: donationId },
             {headers:{ Authorization: token}}
        );
        console.log(response.data);
        toast.success(response.data.message);
    } catch (error) {
        console.error('Error approving donation:', error);
        toast.success(error.data.message)
    }
};




    const handlePhoneNumberChange = (event) => {
      setPhoneNumber(event.target.value);
    };

    if (error) {
      return (
        <div className="w-full max-w-md mx-auto mt-8 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
          Error: {error}
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl min-h-screen mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Donor Responses</h1>
    
      {/* Optional: Input for filtering by phone number */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by phone number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="p-2 border border-gray-300 rounded"
        />
        <button onClick={searchbyphonenumber} className='bg-red-500 text-white py-1 px-3 mt-2 rounded-2xl ml-3'>Search</button>
      </div>
    
      {donorsResponses === null ? (
        <p className="text-lg text-gray-600">No data available</p>
      ) : donorsResponses.length === 0 ? (
        <p className="text-lg text-gray-600">No responses found</p>
      ) : Array.isArray(donorsResponses) ? (
        <ul className="space-y-4">
          {donorsResponses.map((response, index) => (
            <li
              key={index}
              className="p-4 bg-gray-50 border border-gray-300 rounded-md shadow-sm"
            >
              <p className="text-lg font-medium text-gray-900 break-words">Donor Unique ID: {response.donorId}</p>
    
              <p className="text-lg font-medium text-gray-900">Phone Number: {response.phoneNumber}</p>
              <p className="text-red-600">Blood Group: {response.bloodGroup}</p>
              <button onClick={()=>bloodReceived(response.donorId)} className='bg-red-500 text-white py-1 px-4 rounded-2xl'>Blood Received</button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-300 rounded-md shadow-sm">
          <p className="text-lg font-medium text-gray-900">Donor Name: {donorsResponses.name}</p>
          <p className="text-gray-700">Phone Number: {donorsResponses.phoneNumber}</p>
          {/* Add more fields as necessary */}
        </div>
      )}
    </div>
    
    );
  };

  export default HospitalDonorsResponsesDetails;
