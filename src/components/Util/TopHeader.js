import React from 'react';
import { FaBuilding, FaPhone, FaFacebook, FaTwitter, FaGooglePlus, FaInstagram, FaYoutube } from 'react-icons/fa';

const TopHeader = () => {
  return (
    <header className="bg-red-600 flex flex-col md:flex-row justify-between items-center text-white py-2 px-4">
      {/* Left Side: Contact Information */}
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
        <div className="flex items-center">
          <FaBuilding />
          
          <a href="https://www.google.com/maps/dir/29.1755814,75.7279962/29.1755026,75.727792/@29.1755171,75.7253194,17z/data=!3m1!4b1!4m5!4m4!1m1!4e1!1m1!4e1?entry=ttu&g_ep=EgoyMDI0MDkxOC4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer"><span className="ml-2"><strong>Contact:</strong> IINSAF OFFICE SUNDAR NAGAR MAIN GATE </span></a>
        </div>
        <div className="flex items-center">
          <FaPhone />
          <span className="ml-2"><strong>Call Us:</strong> +91 99923-96623</span>
        </div>
      </div>

      {/* Right Side: Social Media Icons */}
      <div className="flex space-x-4 mt-2 md:mt-0">
        <a href="#" className="text-white hover:text-gray-500 transition duration-300">
          <FaFacebook />
        </a>
        <a href="#" className="text-white hover:text-gray-500 transition duration-300">
          <FaTwitter />
        </a>
        <a href="#" className="text-white hover:text-gray-500 transition duration-300">
          <FaGooglePlus />
        </a>
        <a href="#" className="text-white hover:text-gray-500 transition duration-300">
          <FaInstagram />
        </a>
        <a href="#" className="text-white hover:text-gray-500 transition duration-300">
          <FaYoutube />
        </a>
      </div>
    </header>
  );
};

export default TopHeader;
