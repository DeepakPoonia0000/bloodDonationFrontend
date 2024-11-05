import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Aos from 'aos';
import 'aos/dist/aos.css';
import logo from '../images/User.png';  // Replace with hospital logo if available
import { useNavigate } from 'react-router-dom';  // To redirect after login
import { BaseUrl } from '../Util/util';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CgDanger } from 'react-icons/cg';
import { Toast } from 'bootstrap';
const HospitalLoginSignup = () => {


  const [signup, setSignup] = useState(false);
  const [htoken, setToken] = useState(localStorage.getItem('htoken') || "");
  const navigate = useNavigate();
  const [location, setLocation] = useState({ longitude: null, latitude: null });

  const [formData, setFormData] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: ''
    },
    contact: {
      phone: '',
      email: ''
    },
    location: {
      latitude: null,
      longitude: null
    },
    hasBloodDonationCenter: false,
    facilities: [],
    website: '',
    specialInstructions: '',
    password: ''
  });
  // Initialize animations
  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  // If htoken is already present, navigate to dashboard (or any other page)
  useEffect(() => {
    if (htoken) {
      navigate('/hospitalDashboard');  // Replace with the correct path for the logged-in dashboard
    }
  }, [htoken, navigate]);

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


  // Update formData coordinates when location changes
  useEffect(() => {
    if (location.latitude && location.longitude) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      }));
    }
  }, [location]);



  // Handle login logic
  const handleLogin = async () => {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.contact.email) {
      toast.error('Email is required.')
      return;
    } else if (!emailPattern.test(formData.contact.email)) {
      toast.error('Email is not valid.')
      return;
    }

    // Validate password
    if (!formData.password) {
      toast.error('Password is required.')
      return;
    } else if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return;
    }
    // Validate contact
    const phonePattern = /^\d{10}$/; // Example pattern for 10-digit phone number
    if (!formData.contact.phone) {
      toast.error('Phone number is required.')
      return;
    } else if (!phonePattern.test(formData.contact.phone)) {
      toast.error('Phone number must be 10 digits.')
      return;
    }


    try {


      const response = await axios.post(`${BaseUrl}/loginHospital`, { contact: formData.contact, password: formData.password }); // Use email and password for login
      localStorage.setItem('htoken', response.data.token);  // Store htoken in localStorage
      setToken(response.data.token);
      console.log(response)// Update state with token
      window.scroll(0, 0)
      toast.success(response.data.message);
      navigate('/hospitalDashboard');  // Redirect after successful login
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response.data.error)
      toast.error(error.response.data.message)
    }
  };

  // Handle signup logic
  const handleSignup = async () => {

    window.scroll(0, 0)
    // Validate name
    if (!formData.name) {
      toast.error('Name is required.'); // Show error toast
      return; // Exit the function if name is empty
    }

    // Validate address
    if (!formData.address.street) {
      toast.error('Street is required.');
      return;
    }
    if (!formData.address.city) {
      toast.error('City is required.')
      return;
    }
    if (!formData.address.state) {
      toast.error('State is required.')
      return;
    }
    if (!formData.address.postalCode) {
      toast.error('Postal code is required.')
      return;
    } else if (!/^\d{6}$/.test(formData.address.postalCode)) {
      toast.error('Invalid postal code format.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.contact.email) {
      toast.error('Email is required.')
      return;
    } else if (!emailPattern.test(formData.contact.email)) {
      toast.error('Email is not valid.')
      return;
    }

    // Validate password
    if (!formData.password) {
      toast.error('Password is required.')
      return;
    } else if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return;
    }
    // Validate contact
    const phonePattern = /^\d{10}$/; // Example pattern for 10-digit phone number
    if (!formData.contact.phone) {
      toast.error('Phone number is required.')
      return;
    } else if (!phonePattern.test(formData.contact.phone)) {
      toast.error('Phone number must be 10 digits.')
      return;
    }


    // Validate website (if provided)
    // if (formData.website) {
    //   if (!/^(ftp|http|https):\/\/[^ "]+$/.test(formData.website)) {
    //     toast.error('Invalid website URL. Ex: http://localhost.com');
    //     return; // Exit the function if the website URL is invalid
    //   }
    // } else {
    //   toast.error('Please enter wesite');
    //   return
    // }







    if (location.longitude === null || location.latitude === null) {
      toast.error('Location not set. Please enable location services and try again.');
      return; // Stop function execution if location is null
    }
    try {
      const response = await axios.post(`${BaseUrl}/hospitalSignup`, formData).then((response) => {
        window.scroll(0, 0)
        toast.success(`${response.data.message} status: ${response.data.data.status}`);
      });  // Pass the entire formData object
    } catch (error) {
      console.error('Signup failed:', error);
      window.scroll(0, 0);
      toast.error('Signup failed: ' + error.response.data.message);
    }
  };

  // Handle changes to form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value
      }
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        [name]: value
      }
    }));
  };


  if (htoken) {
    return <p>Loading your dashboard...</p>;  // Optionally, render something or handle with `navigate`
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Centered Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border-2 border-gray-300 rounded-lg p-6 shadow-md" >
          <div className="text-center">
            <img alt="Hospital Logo" src={logo} className="mx-auto h-10 w-auto" />
            <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {signup ? 'Sign Up Your Hospital / Organization ' : 'Login to Your Hospital / Organization Account'}
            </h2>
          </div>

          <div className="mt-8">
            <div className="space-y-6">
              {/* Hospital Name - Only for Signup */}
              {signup && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Hospital /Organization Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter Hospital Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              )}

              {/* Address Fields */}
              {signup && (
                <>
                  <div >
                    <label htmlFor="street" className="block text-sm font-medium leading-6 text-gray-900">
                      Street Address
                    </label>
                    <div className="mt-2">
                      <input
                        id="street"
                        name="street"
                        type="text"
                        required
                        placeholder="Enter Street Address"
                        value={formData.address.street}
                        onChange={handleAddressChange}
                        className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div >
                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        placeholder="Enter City"
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div >
                    <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                      State
                    </label>
                    <div className="mt-2">
                      <input
                        id="state"
                        name="state"
                        type="text"
                        required
                        placeholder="Enter State"
                        value={formData.address.state}
                        onChange={handleAddressChange}
                        className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium leading-6 text-gray-900">
                      Postal Code
                    </label>
                    <div className="mt-2">
                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        required
                        placeholder="Enter Postal Code"
                        value={formData.address.postalCode}
                        onChange={handleAddressChange}
                        className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Contact Fields */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email Address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter Email Address"
                    value={formData.contact.email}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        contact: { ...prevData.contact, email: e.target.value },
                      }))
                    }
                    className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm"
                  />

                </div>
              </div>

              {/* Password */}
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
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Phone Number - Only for Signup */}
              {(
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
                      placeholder="Enter Phone Number"
                      value={formData.contact.phone}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          contact: { ...prevData.contact, phone: e.target.value },
                        }))
                      }
                      className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm"
                    />

                  </div>
                </div>
              )}


              {/* Website */}
              {signup && (
                <div >
                  <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                    Website
                  </label>
                  <div className="mt-2">
                    <input
                      id="website"
                      name="website"
                      type="url"
                      required
                      placeholder="Enter Website URL"
                      value={formData.website}
                      onChange={handleChange}
                      className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {signup && (
                <div >
                  <label htmlFor="specialInstructions" className="block text-sm font-medium leading-6 text-gray-900">
                    Special Instructions
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      rows="3"
                      placeholder="Enter any special instructions"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      className="block w-full rounded-md py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              )}


              {/* Checkbox for Blood Donation Center */}
              {signup && (
                <div className='flex items-center  '>
                  <label htmlFor="hasBloodDonationCenter" className="block text-sm font-medium leading-6 text-gray-900">
                    Has Blood Donation Center
                  </label>
                  <input
                    id="hasBloodDonationCenter"
                    name="hasBloodDonationCenter"
                    type="checkbox"
                    checked={formData.hasBloodDonationCenter}
                    onChange={(e) => setFormData((prevData) => ({
                      ...prevData,
                      hasBloodDonationCenter: e.target.checked
                    }))}
                    className=" ml-4"
                  />
                </div>
              )}

              {/* Action Buttons */}
              {signup ? (
                <div >
                  <button
                    onClick={handleSignup}
                    className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleLogin}
                    className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                  >
                    Login
                  </button>
                </div>
              )}

              {/* Toggle between Login and Signup */}
              <div className="mt-4">
                <button
                  onClick={() => setSignup(!signup)}
                  className="w-full flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500"
                >
                  {signup ? 'Already have an account? Login' : 'Create a new hospital account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalLoginSignup;
