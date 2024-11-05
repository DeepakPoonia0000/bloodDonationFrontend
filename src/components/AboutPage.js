import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import logo from './images/lovepik-world-blood-donation-day-vector-illustration-blood-png-image_401398810_wh1200-removebg-preview 1.png';
import leftsideimage from './images/bloodDonationLogin(1).jpg';
import { Link } from 'react-router-dom';

const AboutPage = () => {
console.log(leftsideimage)

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <div className='h-screen flex items-center mb-10 mt-20'>
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
          
          {/* Left-side image */}
          <div className="md:flex-shrink-0 md:w-1/2" data-aos="fade-right">
            <img className="h-full w-full object-cover" src={leftsideimage} alt="Blood Donation Left" />
          </div>
          
          {/* Right-side content */}
          <div className="p-8 md:w-2/3">
            <div className="flex items-center mb-4" data-aos='fade-left'>
              <img className="h-16 w-16 mr-4" src={logo} alt="Blood Donation" />
              <h2 className="text-2xl font-bold text-gray-900">Blood Donation Event</h2>
            </div>
            <p className="mt-2 text-gray-600">
              Blood donation is a critical action that helps save lives. Every donor is a hero. Join our event to donate blood and make a difference.
            </p>
            <div className="mt-4 space-y-2">
              <div className="text-gray-700">
                <span className="font-semibold">Date:</span> September 30, 2024
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Location:</span> Red Cross Center, Main Hall
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Time:</span> 9:00 AM - 3:00 PM
              </div>
              <div className="text-gray-700 mt-2">
                <span className="font-semibold">Contact:</span> +91-99923-96623
              </div>
            </div>
            <div className='mt-3'>
            <Link to='/home' className="mt-6  mt-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">
              Sign Up to Donate
            </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
