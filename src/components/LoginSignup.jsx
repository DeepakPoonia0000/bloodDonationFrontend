import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// import aosx from 'aosx';
// import 'aosx/dist/aosx.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './images/iinsaf.png';
import left from './images/bloodDonationLogin3.jpg';
import login1 from './images/bloodDonationLogin1.jpg';
import login2 from './images/bloodDonationLogin2.jpg';
import login3 from './images/bloodDonationLogin3.jpg';
import login4 from './images/bloodDonationLogin4.jpg';
import login5 from './images/bloodDonationLogin5.jpg';
import { BaseUrl } from './Util/util';

const images = [left, login1, login2, login3, login4, login5];

const LoginSignup = ({ setToken, signup, setsignup }) => {
  const [name, setname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [email, setEmail] = useState('');
  const [ngoName,setngoName] = useState('');
  const [location, setLocation] = useState({ longitude: null, latitude: null });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signupbuttonclick, setsignupbutton] = useState(false);
  const [otp, setotp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // aosx.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({
              longitude,
              latitude
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert("Please enable location permissions for this app.");
                break;
              case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable. Please try again later.");
                break;
              case error.TIMEOUT:
                alert("The request to get your location timed out. Please try again.");
                break;
              case error.UNKNOWN_ERROR:
                alert("An unknown error occurred. Please try again.");
                break;
              default:
                console.log("There is no error is fetching location");
            }
          }
        );
      } else {
        alert('Geolocation is not supported by this browser');
      }
    };
    getLocation();
  }, [])

  // Slide effect for images
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleLogin = async () => {
    if (location.longitude === null || location.latitude === null) {
      toast.error('Location not set. Please enable location services and try again.');
      return; // Stop function execution if location is null
    }

    if (!phoneNumber || phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      toast.error('Invalid phone number. It must be exactly 10 digits.');
      return;
    }

     // Password validation: Ensure the password is at least 6 characters long (you can add more rules like including numbers or special characters)
     if (!password || password.length < 6) {
      window.scroll(0, 0);
      toast.error('Invalid password. It must be at least 6 characters long.');
      return;
    }


    try {
      const response = await axios.post(`${BaseUrl}/loginUser`, { phoneNumber, password, location });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      console.log(response);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }

    }
  };

  const handleSignup = async () => {
    // Phone number validation: Check if it's exactly 10 digits
    if (!phoneNumber || phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      toast.error('Invalid phone number. It must be exactly 10 digits.');
      return;
    }
    // Name validation: Ensure the name is not empty
    if (!name || name.trim() === "") {
      toast.error('Name is required.');
      return;
    }

    // Email validation: Using a regular expression to check if the email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      window.scroll(0, 0);
      toast.error('Invalid email format.');
      return;
    }

    // Password validation: Ensure the password is at least 6 characters long (you can add more rules like including numbers or special characters)
    if (!password || password.length < 6) {
      window.scroll(0, 0);
      toast.error('Invalid password. It must be at least 6 characters long.');
      return;
    }


    // Blood group validation: Check if the blood group is valid (new blood group options added)
    const validBloodGroups = [
      'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-',
      'a2+', 'a2-', 'a2b+', 'a2b-', 'hh', 'inra'
    ];

    if (!bloodGroup || !validBloodGroups.includes(bloodGroup.toLowerCase())) {
      window.scroll(0, 0);
      toast.error('Invalid blood group. Please select a valid blood group.');
      return;
    }

    // Proceed with signup if all validations pass
    try {
      const response = await axios.post(`${BaseUrl}/addUser`, { phoneNumber, password, bloodGroup, email, name,ngoName });
      console.log(response.data);
      toast.success(` ${response.data.message}`);
      setsignupbutton(true);
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.error);
    } finally {
      // setsignupbutton(true);
    }
  };




  // for otp veryficatoin 
  const handelotpvery = async () => {

    try {
      const response = await axios.post(`${BaseUrl}/verifyOtp`, { email, otp });
      console.log(response.data);
      window.scroll(0, 0)
      toast.success("Otp Verify Successfully");
      navigate('/')

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.error)
    }
  }




  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url(${images[currentIndex]})`, // Set the current image as the background
        backgroundSize: 'cover', // Cover the entire background
        backgroundPosition: 'center', // Center the background image
      }}
    >
      <h1>{signupbuttonclick}</h1>
      {/* Outer border container */}
      <div className="w-full max-w-md bg-white border-4 border-gray-300 rounded-lg shadow-lg p-6" data-aosx="fade-left">
        {/* Logo and Title */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm" data-aosx="zoom-in">
          <img alt="Your Company" src={logo} className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {signup ? 'Sign Up to Your Account' : 'Login to Your Account'}
          </h2>
        </div>

        {/* Form Inputs */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">



            {/* Phone Number Input */}
            <div data-aosx="fade-up" className={signupbuttonclick ? "hidden" : "block"} >
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="number"
                  required
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full rounded-md border-1 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* email input  */}
            {signup && (
              <>
                {/* name input  */}
                <div data-aosx="fade-up">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      className="block w-full rounded-md border-1 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      disabled={signupbuttonclick}
                    />
                  </div>
                </div>
                <div data-aosx="fade-up">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-1 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      disabled={signupbuttonclick}
                    />
                  </div>
                </div>
                <div data-aosx="fade-up">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Ngo Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="ngoName"
                      name="ngoName"
                      type="text"
                      required
                      placeholder="Enter Your Ngo Name"
                      value={ngoName}
                      onChange={(e) => setngoName(e.target.value)}
                      className="block w-full rounded-md border-1 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      disabled={signupbuttonclick}
                    />
                  </div>
                </div>  
              </>
            )}


            {signupbuttonclick && signup && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">Enter OTP</label>
                <input
                  id='otp'
                  name='otp'
                  type='number'
                  required
                  placeholder='Enter  OTP'
                  value={otp}
                  onChange={(e) => setotp(e.target.value)}
                  className="block w-full rounded-md border-1 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {/* Add the missing onClick handler for OTP verification */}
                <button
                  className='border-2 py-1 rounded-2xl text-white px-4 mt-3 bg-green-600'
                  onClick={handelotpvery}
                >
                  Verify
                </button>
              </div>
            )}


            {/* Password Input */}
            <div data-aosx="fade-up" className={signupbuttonclick ? "hidden" : "block"}>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-1 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>


            {/* Conditional Blood Group Selection - Shown only if signup is true */}
            {signup && (
              <div data-aosx="fade-up" className={signupbuttonclick ? "hidden" : "block"}>
                <label htmlFor="bloodGroup" className="block text-sm font-medium leading-6 text-gray-900">
                  Blood Group
                </label>
                <div className="mt-2">
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    required
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select Your Blood Group</option>
                    <option value="a+">A+</option>
                    <option value="a-">A-</option>
                    <option value="b+">B+</option>
                    <option value="b-">B-</option>
                    <option value="ab+">AB+</option>
                    <option value="ab-">AB-</option>
                    <option value="o+">O+</option>
                    <option value="o-">O-</option>
                    <option value="a2+">A2+</option>
                    <option value="a2-">A2-</option>
                    <option value="a2b+">A2B+</option>
                    <option value="a2b-">A2B-</option>
                    <option value="hh">HH (Bombay Blood Group)</option>
                    <option value="inra">INRA</option>
                  </select>
                </div>
              </div>
            )}

            {/* Login and Signup Buttons */}
            {signup ? (
              <div data-aosx="fade-left0" className={signupbuttonclick ? "hidden" : "block"}>
                <button
                  onClick={handleSignup}
                  className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Signup
                </button>
              </div>
            ) : (
              <>
                <div data-aosx="fade-left">
                  <button
                    onClick={handleLogin}
                    className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Login
                  </button>
                </div>

                {/* Create Account Button */}
                <div className="mt-4" data-aosx="fade-left">
                  <button
                    onClick={() => setsignup(true)}
                    className="w-full flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    Create Account
                  </button>
                </div>
              </>
            )}

            {/* Toggle between Login and Signup */}
            {signup && (
              <div className="mt-4" data-aosx="fade-left" >
                <button
                  onClick={() => { setsignup(false); setsignupbutton(false) }}
                  className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Already have an account? Login
                </button>
              </div>
            )}


            <div>
              {!signup &&
                <Link className='text-blue-700' to="/forgetPassword">Forget Password</Link>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default LoginSignup;
