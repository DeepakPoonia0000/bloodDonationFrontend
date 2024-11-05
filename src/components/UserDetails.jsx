import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BaseUrl } from './Util/util';

const UserDetails = () => {
    const [requestId, setRequestId] = useState('');
    const [user, setUser] = useState({});
    const [donationRequests, setDonationRequests] = useState([]);
    const [previousDonationRequests, setPreviousDonationRequests] = useState([]);

    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams(location.search);
            const requestId = queryParams.get('userId');
            setRequestId(requestId);

            if (requestId) {
                const token = localStorage.getItem('adminToken');
                try {
                    const response = await axios.get(`${BaseUrl}/userDetails`, {
                        headers: { Authorization: token },
                        params: { requestId: requestId }
                    });
                    console.log("this is the response from the server for fetchData =>", response.data);
                    setUser(response.data.userDetails || {});
                    setDonationRequests(response.data.donationRequests || []);
                    setPreviousDonationRequests(response.data.previousDonationRequests || []);
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [location.search]);


    
    

    return (
        <>
        <div className="p-6">
            <div className='flex items-center justify-center'>
                <Link to='/admin' className="text-lg block mb-4 px-3 py-1 rounded-2xl no-underline hover:underline hover:bg-green-700 bg-green-500 text-white"> Admin Home</Link>
            </div>
            <hr className='text-white border-5' />
            <div className='mt-10 space-y-10'>
                {/* User Details Section */}
                <div className="border border-gray-300 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold break-words">User Details {requestId}</h2>
                    <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
                    <p><strong>Joined On:</strong> {user.joinedOn ? new Date(user.joinedOn).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                </div>
    
                {/* Active Donation Requests */}
                <div className="border border-gray-300 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold">Active Donation Requests</h2>
                    {donationRequests.length > 0 ? (
                        donationRequests.map((donation, index) => (
                            <div key={donation._id} className="donation-request mb-6">
                                <h3 className="text-xl font-semibold">Request #{index + 1} - {donation._id}</h3>
                                <p><strong>Blood Group:</strong> {donation.bloodGroup}</p>
                                <p><strong>Date of Query:</strong> {new Date(donation.dateOfQuery).toLocaleString()}</p>
                                <Link to={`/donorsResponseAdmin?requestId=${donation._id}`}>
                                    <p><strong>Donors Response:</strong> {donation.donorsResponse.length > 0 ? donation.donorsResponse.join(', ') : 'No responses yet'}</p>
                                </Link>
                                <p><strong>Expire At:</strong> {new Date(donation.expireAt).toLocaleString()}</p>
                                <p><strong>Location:</strong> Longitude: {donation.location.longitude}, Latitude: {donation.location.latitude}</p>
                                <p><strong>Name:</strong> {donation.name}</p>
                                <p><strong>Phone Number:</strong> {donation.phoneNumber}</p>
                            </div>
                        ))
                    ) : (
                        <p>No donation requests available.</p>
                    )}
                </div>
    
                {/* Previous Donation Requests */}
                <div className="border border-gray-300 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold">Previous Donation Requests</h2>
                    {previousDonationRequests.length > 0 ? (
                        previousDonationRequests.map((donation, index) => (
                            <div key={donation._id} className="donation-request mb-6">
                                <h3 className="text-xl font-semibold">Request #{index + 1} - {donation._id}</h3>
                                <p><strong>Blood Group:</strong> {donation.bloodGroup}</p>
                                <p><strong>Date of Query:</strong> {new Date(donation.dateOfQuery).toLocaleString()}</p>
                                <p><strong>Location:</strong> Longitude: {donation.location.longitude}, Latitude: {donation.location.latitude}</p>
                                <p><strong>Name:</strong> {donation.name}</p>
                                <p><strong>Phone Number:</strong> {donation.phoneNumber}</p>
                            </div>
                        ))
                    ) : (
                        <p>No previous donation requests available.</p>
                    )}
                </div>
            </div>
        </div>
    </>
    
    );
};

export default UserDetails;
