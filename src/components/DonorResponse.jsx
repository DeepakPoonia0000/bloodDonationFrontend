import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {BaseUrl} from './Util/util'
import { toast } from 'react-toastify';

const DonorResponse = ({ setToken }) => {
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [requestNumber, setrequestNumber] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  setToken(localStorage.getItem('token'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const requestNumber = queryParams.get('requestNumber');
    setrequestNumber(requestNumber);
    if (requestNumber) {
      getSentRequests(requestNumber);
    } else {
      setError('No request number found in the URL.');
    }
  }, [location.search]);

  const getSentRequests = async (requestNumber) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${BaseUrl}/getDonorsResponses`,
        {
          params: { requestId: requestNumber },
          headers: { Authorization: token }
        }
      );
      setResponses(response.data.donorsResponse);
    } catch (error) {
      console.error('Request failed:', error);
      setError('Failed to fetch donor responses. Please try again.');
    }
  };

  const handleBloodReceived = (donorId, phoneNumber) => {
    console.log('Blood received from donor with ID:', donorId);
    console.log('Donor Phone Number:', phoneNumber);
    console.log(requestNumber);
    const token = localStorage.getItem('token');
    try {
      const response = axios.post(`${BaseUrl}/approveDonation`,
        { donorId, donationId: requestNumber },
        {
          headers: { Authorization: token }
        }
      )
    } catch (error) {
      console.log(error)
    }

    navigate('/bloodRequirement');
  };

  const handeldelte = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${BaseUrl}/deleteBloodRequestUser`,
        {
          params: {id: requestNumber },
          headers: { Authorization: token }
        }
      )
      toast.success(response.data.message);
      navigate('/bloodRequirement');
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
        <button onClick={handeldelte} className='bg-violet-500 text-white py-1 px-3 rounded-2xl' >Delete Request</button>
        <div>
          <h2 className="text-2xl font-bold mb-4">Donor Responses</h2>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by phone number"
            className="w-full border-2 p-7 p-2 pl-10 text-sm text-gray-700"
          />
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex items-center justify-between flex-col w-full">
        {responses.length > 0 ? (
          <ul className="list-none flex flex-wrap gap-3 mt-4 mb-4">
            {responses
              .filter((response) => {
                const phoneNumber = response.phoneNumber ? response.phoneNumber.toString() : '';
                return phoneNumber.includes(search);
              })
              .map((response, index) => (
                <div className="bg-white shadow-md rounded-md p-4 md:p-6 lg:p-8 border border-gray-200 overflow-hidden" key={index}>
                  <li className="mb-4">
                    <p className="text-lg">Donor ID: {response.donorId}</p>
                    <p className="text-lg">Phone Number: {response.phoneNumber}</p>
                    <p className="text-lg">Blood Group: {response.bloodGroup}</p>
                    <button
                      className="bg-red-500 px-4 py-2 rounded-2xl text-white text-xl font-serif"
                      onClick={() => handleBloodReceived(response.donorId, response.phoneNumber)}
                    >
                      Blood Received
                    </button>
                  </li>
                </div>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">No responses available</p>
        )}
      </div>
    </>
  );
};

export default DonorResponse;
