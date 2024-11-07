import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BaseUrl } from './Util/util';

const UserDetails = () => {
    const [requestId, setRequestId] = useState('');
    const [user, setUser] = useState({});
    const [donationRequests, setDonationRequests] = useState([]);
    const [previousDonationRequests, setPreviousDonationRequests] = useState([]);
    const [selectedField, setSelectedField] = useState("bloodRequest");

    // Function to handle label click
    const handleLabelClick = (field) => {
        setSelectedField(field);
    };


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
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center mb-8">
                    <Link
                        to="/admin"
                        className="text-lg px-4 py-2 rounded-2xl no-underline bg-green-500 text-white font-semibold shadow-md transition duration-300 transform hover:scale-105 hover:bg-green-700 hover:underline"
                    >
                        Admin Home
                    </Link>
                </div>

                <hr className="border-t-2 border-gray-300 mb-10" />

                <div className="space-y-10">
                    {/* User Details Section */}
                    <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Details: {requestId}</h2>
                        <p className="text-gray-700"><strong>Blood Group:</strong> {user.bloodGroup}</p>
                        <p className="text-gray-700">
                            <strong>Joined On:</strong> {user.joinedOn ? new Date(user.joinedOn).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-700"><strong>Phone Number:</strong> {user.phoneNumber}</p>
                    </div>

                    <div className="flex space-x-4 mb-4 justify-center">
                        <button
                            onClick={() => handleLabelClick("Active Requests")}
                            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 shadow-lg">
                            Active Requests
                        </button>

                        <button
                            onClick={() => handleLabelClick("Previous Requests")}
                            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 shadow-lg">
                            Previous Requests
                        </button>
                    </div>

                    {/* Active Donation Requests */}
                    {selectedField === "Active Requests" && (
                        <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Donation Requests</h2>
                            {donationRequests.length > 0 ? (
                                donationRequests.map((donation, index) => (
                                    <div
                                        key={donation._id}
                                        className="donation-request p-6 bg-opacity-95 bg-gray-50 rounded-lg shadow-md border border-gray-200
                   transition-all transform hover:scale-105 hover:bg-gray-100 hover:shadow-lg space-y-4"
                                    >
                                        <h3 className="text-2xl font-semibold text-black tracking-wide mb-2">
                                            Request #{index + 1}
                                            <span className="text-lg text-gray-600 block">ID: {donation._id}</span>
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                                            <p className="font-medium">
                                                <strong>Blood Group:</strong>
                                                <span className="px-2 py-1 rounded bg-red-100 text-red-600 ml-2 shadow-sm">
                                                    {donation.bloodGroup}
                                                </span>
                                            </p>

                                            <p><strong>Query Date:</strong> {new Date(donation.dateOfQuery).toLocaleString()}</p>

                                            <Link
                                                to={`/donorsResponseAdmin?requestId=${donation._id}`}
                                                className="text-red-600 hover:text-red-500 transition-colors col-span-2"
                                            >
                                                <p><strong>Donors Response:</strong> {donation.donorsResponse.length > 0 ? donation.donorsResponse.join(', ') : 'No responses yet'}</p>
                                            </Link>

                                            <p><strong>Expires At:</strong> {new Date(donation.expireAt).toLocaleString()}</p>

                                            <p><strong>Location:</strong>
                                                <span className="text-sm ml-2 text-gray-600">Long: {donation.location.longitude}, Lat: {donation.location.latitude}</span>
                                            </p>
                                        </div>

                                        <div className="mt-3 space-y-1">
                                            <p className="text-gray-800"><strong>Name:</strong> {donation.name}</p>
                                            <p className="text-gray-800"><strong>Phone:</strong> {donation.phoneNumber}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-center text-xl mt-10">No donation requests available.</p>
                            )}
                        </div>
                    )}

                    {/* Previous Donation Requests */}

                    {selectedField === "Previous Requests" && (
                        <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Previous Donation Requests</h2>
                            {previousDonationRequests.length > 0 ? (
                                previousDonationRequests.map((donation, index) => (
                                    <div
                                        key={donation._id}
                                        className="donation-request p-6 bg-opacity-95 bg-gray-50 rounded-lg shadow-md border border-gray-200
                   transition-all transform hover:scale-105 hover:bg-gray-100 hover:shadow-lg space-y-4"
                                    >
                                        <h3 className="text-2xl font-semibold text-black tracking-wide mb-2">
                                            Previous Request #{index + 1}
                                            <span className="text-lg text-gray-600 block">ID: {donation._id}</span>
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                                            <p className="font-medium">
                                                <strong>Blood Group:</strong>
                                                <span className="px-2 py-1 rounded bg-red-100 text-red-600 ml-2 shadow-sm">
                                                    {donation.bloodGroup}
                                                </span>
                                            </p>

                                            <p><strong>Query Date:</strong>
                                                <span className="text-red-600 ml-2">{new Date(donation.dateOfQuery).toLocaleString()}</span>
                                            </p>

                                            <p><strong>Location:</strong>
                                                <span className="text-sm ml-2 text-gray-600">
                                                    Long: {donation.location.longitude}, Lat: {donation.location.latitude}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="mt-3 space-y-1">
                                            <p className="text-gray-800">
                                                <strong className="text-black">Name:</strong> {donation.name}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong className="text-black">Phone:</strong> {donation.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-center text-xl mt-10">No previous donation requests available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>

    );
};

export default UserDetails;
