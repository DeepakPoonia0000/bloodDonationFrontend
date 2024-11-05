import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BaseUrl } from '../Util/util';

const HospitalDetails = () => {
    const [requestId, setRequestId] = useState('');
    const [hospital, setHospital] = useState({});
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
                    const response = await axios.get(`${BaseUrl}/hospital-details`, {
                        headers: { Authorization: token },
                        params: { requestId: requestId }
                    });
                    console.log("this is the response from the server for fetchData =>", response.data);
                    setHospital(response.data.hospitalDetails || {});
                    setDonationRequests(response.data.donationRequests || []);
                    setPreviousDonationRequests(response.data.previousDonationRequests || []);
                    
                    // Example for fetching donation requests
                    // const donationResponse = await axios.get(`${BaseUrl}/donation-requests`, {
                    //     headers: { Authorization: token },
                    //     params: { requestId: requestId }
                    // });
                    // setDonationRequests(donationResponse.data.activeRequests || []);
                    // setPreviousDonationRequests(donationResponse.data.previousRequests || []);

                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [location.search]);
    return (
        <>
            <div className="p-6 lg:px-12 bg-red-50 min-h-screen">
                {/* Admin Home Button */}
                <div className="flex items-center justify-center mb-6">
                    <Link 
                        to='/admin' 
                        className="text-lg px-4 py-2 rounded-lg no-underline hover:bg-red-600 bg-red-500 text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                        Admin Home
                    </Link>
                </div>
                
                {/* Divider */}
                <hr className="border-red-400 mb-8" />
    
                <div className="space-y-10">
                    {/* Hospital Details Section */}
                    <div className="border border-red-300 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Hospital/Organizations Details {requestId}</h2>
                        <p><strong>Name:</strong> {hospital.name}</p>
                        <p><strong>Address:</strong> {hospital.address ? `${hospital.address.street}, ${hospital.address.city}, ${hospital.address.state}, ${hospital.address.postalCode}` : 'N/A'}</p>
                        <p><strong>Phone:</strong> {hospital.contact ? hospital.contact.phone : 'N/A'}</p>
                        <p><strong>Email:</strong> {hospital.contact ? hospital.contact.email : 'N/A'}</p>
                        <p><strong>Website:</strong> {hospital.website}</p>
                        <p><strong>Operating Hours:</strong> {hospital.operatingHours ? Object.entries(hospital.operatingHours).map(([day, hours]) => `${day}: ${hours}`).join(', ') : 'N/A'}</p>
                        <p><strong>Special Instructions:</strong> {hospital.specialInstructions}</p>
                        <p><strong>Status:</strong> {hospital.status}</p>
                        <p><strong>Coordinates:</strong> Latitude: {hospital.coordinates?.latitude ?? 'N/A'}, Longitude: {hospital.coordinates?.longitude ?? 'N/A'}</p>
                        <p><strong>Has Blood Donation Center:</strong> {hospital.hasBloodDonationCenter ? 'Yes' : 'No'}</p>
                    </div>
    
                    {/* Current Requests Section */}
                    <h2 className="text-xl font-semibold text-red-600">Current Request</h2>
                    <div className="border border-red-300 bg-white p-6 rounded-lg shadow-md space-y-4">
                        {donationRequests.map((request, index) => (
                            <div key={index} className="p-4 bg-red-50 rounded-lg">
                                <p><strong>Request ID:</strong> {request._id}</p>
                                <p><strong>Date:</strong> {request.dateOfQuery}</p>
                                <p className='text-red-500'><strong>Blood Group:</strong> {request.bloodGroup}</p>
                                <Link to={`/donorresponsehospitaladmin?requestId=${request._id}`} className="text-red-500 hover:underline">View Details</Link>
                            </div>
                        ))}
                    </div>
    
                    {/* Previous Requests Section */}
                    <h2 className="text-xl font-semibold text-red-600">Previous Requests</h2>
                    <div className="border border-red-300 bg-white p-6 rounded-lg shadow-md space-y-4">
                        {previousDonationRequests.map((request, index) => (
                            <div key={index} className="p-4 bg-red-50 rounded-lg">
                                <p><strong>Request ID:</strong> {request._id}</p>
                                <p><strong>Date:</strong> {request.dateOfQuery}</p>
                                <p className='text-red-500'><strong>Blood Group:</strong> {request.bloodGroup}</p>
                                {/* <Link to={`/request/${request._id}`} className="text-red-500 hover:underline">View Details</Link> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
    
};

export default HospitalDetails;
