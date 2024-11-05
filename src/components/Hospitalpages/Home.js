import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../Util/util';
import { Link } from 'react-router-dom';

const Home = () => {
    const [activeRequests, setActiveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem('htoken');
            try {
                const response = await axios.get(`${BaseUrl}/getHospitalRequests`, {
                    headers: { Authorization: token }
                });
                setActiveRequests(response.data.activeRequests);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) return <p className="text-center py-4">Loading...</p>;
    if (error) return <p className="text-center py-4 text-red-500">Error: {error}</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1>Dashborad</h1>
        <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">Active Blood Donation Requests</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
            {activeRequests.length > 0 ? (
                <ul className="space-y-6">
                    {activeRequests.map((request) => (
                        <li key={request._id} className="bg-red-50 hover:bg-red-100 transition-colors duration-300 p-4 rounded-lg shadow-md">
                            <Link to={`/HospitalDonorsResponses?userId=${request._id}`} className="block w-full">
                                <div className="flex flex-col sm:flex-row sm:justify-between items-center">
                                    {/* Request ID */}
                                    <div className="flex flex-col mb-2 sm:mb-0">
                                        <span className="text-gray-600 font-semibold">Request ID:</span>
                                        <span className="text-red-700 font-medium">{request._id}</span>
                                    </div>
                                    {/* Date */}
                                    <div className="flex flex-col mb-2 sm:mb-0">
                                        <span className="text-gray-600 font-semibold">Date:</span>
                                        <span className="text-red-700">{new Date(request.dateOfQuery).toLocaleDateString()}</span>
                                    </div>
                                    {/* Donors Response */}
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 font-semibold">Donors Response:</span>
                                        <span className="text-red-700">{request.donorsResponse.length}</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No active requests available.</p>
            )}
        </div>
    </div>
    
    );
};

export default Home;
