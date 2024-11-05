import React from 'react';
import instasvg from './images/icons8-instagram.svg'
import twittersvg from './images/icons8-twitter.svg'
import linkedinsvg from './images/icons8-linkedin.svg'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#2F2F2F] text-gray-200 py-8 bottom-0  w-full">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold">Blood Donation Hub</h2>
            <p className="text-gray-400 mt-2">Saving lives through the power of donation.</p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-12">
            <div className="mb-6 md:mb-0 flex flex-col  items-center justify-center">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-2 flex flex-wrap">
                <li><a href="/" className=" text-white ml-2 no-underline hover:underline  hover:text-red-500">Home</a></li>
                <li><a href="/about" className=" text-white ml-2 no-underline hover:underline  hover:text-red-500">About</a></li>
                <li><Link to="/loginsignup" className=" text-white ml-2 no-underline hover:underline  hover:text-red-500">Donate</Link></li>
                <li><a href="/about" className=" text-white ml-2 no-underline hover:underline  hover:text-red-500">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Follow Us</h3>
              <div className="mt-2 flex space-x-4 items-center justify-center">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <img className='h-8' src={instasvg}/>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                <img className='h-8' src={twittersvg}/>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                <img className='h-8' src={linkedinsvg}/>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-gray-400 text-sm">&copy; Developed by Iinsaf Team . All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
