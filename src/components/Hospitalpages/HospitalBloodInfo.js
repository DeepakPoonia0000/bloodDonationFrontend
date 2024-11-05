import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BaseUrl } from '../Util/util';
import axios from 'axios';

const HospitalBloodInfo = () => {
    const [hospitalrequest, sethospitalrequest] = useState([]);
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null
    });

    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const sendLocation = async () => {
        const token = localStorage.getItem('token');
    
        if (location.latitude && location.longitude) {
            try {
                const response = await axios.get(`${BaseUrl}/getAllHospitalRequests`, {
                    params: { location },
                    headers: { Authorization: token },
                });
                console.log(response)
                sethospitalrequest(response.data.hospitalRequests || []);
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        if (location.latitude && location.longitude) {
            sendLocation();
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-red-50">
            <div className="w-full p-4 sm:p-6 rounded-lg relative flex flex-col  max-w-4xl md:max-w-6xl mx-auto">
                <div className="bg-white p-1 flex flex-col items-center  mt-11 justify-center shadow-md">
                    <h2 className="text-2xl sm:text-3xl font-bold mt-6 sm:mt-10 text-red-600 mb-4 sm:mb-6 text-center">
                        Blood Donation Requests
                    </h2>
    
                    {hospitalrequest.length === 0 ? (
                        <div className="text-center text-gray-500 font-medium text-base sm:text-xl">
                            No requests near your location. Stay tuned for future donation opportunities!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {hospitalrequest.map((request, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-white rounded-lg shadow-lg border border-red-200 hover:shadow-xl transform hover:scale-105 transition-transform flex flex-col space-y-4"
                                >
                                    <div className="text-lg font-semibold text-red-700">
                                        Hospital Name:
                                        <span className="font-normal text-gray-700"> {request.name}</span>
                                    </div>
    
                                    <Link 
                                        to={`/hospitaldonationDetails?donationId=${request._id}`} 
                                        className="inline-block text-center text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg font-medium transition-all"
                                    >
                                        Donate Now
                                    </Link>
    
                                    <div className="text-lg font-semibold text-red-700">
                                        Needed Blood Group:
                                        <span className="font-normal text-gray-700"> {request.bloodGroup}</span>
                                    </div>
    
                                    <div className="text-lg font-semibold text-red-700">
                                        Hospital Location:
                                        <a
                                            href={`https://www.google.com/maps?q=${request.location.latitude},${request.location.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-500 hover:underline"
                                        >
                                            Open Google Map
                                        </a>
                                    </div>
    
                                    <div className="text-lg font-semibold text-red-700">
                                        Phone Number:
                                        <span className="font-normal text-gray-700"> {request.phoneNumber}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
}

export default HospitalBloodInfo;
