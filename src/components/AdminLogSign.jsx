import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './images/iinsaf.png';  // Ensure the correct path for the logo
import loginImage from './images/bloodDonationLogin1.jpg'; // Add an image on the left side
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BaseUrl } from './Util/util';

export default function AdminLogSign({ setAdminToken }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        AOS.init({ duration: 1000 }); // Initialize AOS with 1 second animation duration
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BaseUrl}/adminLogin`, { phoneNumber, password });
            localStorage.setItem('adminToken', response.data.token);
            setAdminToken(response.data.token);
            console.log(response);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-gray-100">
            <div className="flex flex-col md:flex-row border-2 border-gray-300 rounded-lg shadow-md bg-white">
                
                {/* Left side image */}
                <div className="hidden md:block md:w-1/2 lg:w-1/2 h-full">
                    <img
                        src={loginImage}
                        alt="Login Illustration"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Login form section */}
                <div className="flex flex-col justify-center items-center sm:w-full md:w-1/2 lg:w-1/2 p-4">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm" data-aos="zoom-in"> 
                        <img
                            alt="Logo"
                            src={logo}
                            className="mx-auto h-10 w-auto"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Admin Login
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm" data-aos="fade-right">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                    Phone Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="number"
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    data-aos="fade-up"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
