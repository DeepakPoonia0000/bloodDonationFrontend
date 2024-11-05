import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { BaseUrl } from './Util/util';
import userlogo from './images/User.png'; // Assuming the same user logo
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const bloodGroups = [
  'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-', 'hh (bombay blood group)', 'inra'
];

// Blood compatibility mapping
const compatibility = {
  'a+': ['a+', 'ab+'],
  'a-': ['a+', 'a-', 'ab+', 'ab-'],
  'b+': ['b+', 'ab+'],
  'b-': ['b+', 'b-', 'ab+', 'ab-'],
  'ab+': ['ab+'],
  'ab-': ['ab+', 'ab-'],
  'o+': ['o+', 'a+', 'b+', 'ab+'],
  'o-': ['o+', 'o-', 'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-'],
  'hh (bombay blood group)': ['hh (bombay blood group)'],
  'inra': ['inra']
};

const HospitalDonationDetails = () => {
  // State to store donation and form details
  const [donationDetails, setDonationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [filteredBloodGroups, setFilteredBloodGroups] = useState(bloodGroups);
  const [requiredBlood, setRequiredBlood] = useState('');
  const location = useLocation();
  const  navigate = useNavigate();
  // Extract donationId from the URL params
  const queryParams = new URLSearchParams(location.search);
  const donationId = queryParams.get('donationId');

  // Fetch donation details when component mounts
  useEffect(() => {
    const fetchDonationDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${BaseUrl}/hospitlDonationDetail`, {
          params: { donaterId: donationId },
          headers: { Authorization: token },
        });
        setDonationDetails(response.data);
        setRequiredBlood(response.data.bloodGroup.toLowerCase());
      } catch (err) {
        setError('Error fetching donation details');
      } finally {
        setLoading(false);
      }
    };

    if (donationId) {
      fetchDonationDetails();
    }
  }, [donationId]);

  // Update filtered blood groups based on compatibility
  useEffect(() => {
    if (requiredBlood) {
      setFilteredBloodGroups(bloodGroups.filter(group => compatibility[group]?.includes(requiredBlood)));
    }
  }, [requiredBlood]);

  useEffect(()=> {
    const token = localStorage.getItem('token')
    if(!token){
      navigate('/loginsignup')
    }
  },[])

  const handleResponseSubmit = async () => {
    const token = localStorage.getItem('token')
    const data = {
        requestId: donationId,
        phoneNumber,
        bloodGroup
    };

    if (phoneNumber.length < 10) {
        window.alert('Phone number must be at least 10 characters long.');
        return;
    }
    
    if (age < 16 || age>65) {
        window.alert('You must be between 16 to 65 years old to donate.');
        return;
    }

    if (gender === 'male' && weight < 50) {
        window.alert('Males must weigh at least 50kg to donate.');
        return;
    }

    if (gender === 'female' && weight < 50) {
        window.alert('Females must weigh at least 50kg to donate.');
        return;
    }

    try {
      const response = await axios.post(`${BaseUrl}/addDonorToTheHospitalRequest`, data, {
        headers: { Authorization: token },
      });
      window.scroll(0,0);
      toast.success(response.data.message)
      setResponse('');
    } catch (err) {
      console.error('Error submitting response:', err);
      window.scroll(0,0);
    toast.error(err.response.data.message);
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="donation-details border mx-4 md:mx-6 lg:mx-8 mt-5 p-4 flex flex-col items-center mb-10">
    <div className="flex flex-wrap md:border-4 md:px-12 p-4 bg-gray-300 font-montserrat">
      <div className="mt-8 flex items-center justify-center w-full md:hidden">
        <img className="h-32" src={userlogo} alt="User Logo" />
      </div>
      <div className="flex flex-col items-start w-full md:w-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Hospital Donation Details</h1>
  
        {donationDetails ? (
          <>
            <div className="flex flex-wrap justify-between w-full mb-2">
              <p><strong>Donater ID:</strong></p>
              <p>{donationDetails._id}</p>
            </div>
  
            <div className="flex flex-wrap justify-between w-full mb-2">
              <p><strong>Name:</strong></p>
              <p>{donationDetails.name}</p>
            </div>
  
            <div className="flex flex-wrap justify-between w-full mb-2">
              <p><strong>Blood Group:</strong></p>
              <p>{donationDetails.bloodGroup}</p>
            </div>
  
            <div className="flex flex-wrap justify-between w-full mb-2">
              <p><strong>Hospital Phone Number:</strong></p>
              <p>{donationDetails.phoneNumber}</p>
            </div>
          </>
        ) : (
          <p>No donation details found.</p>
        )}
  
        <div className="mt-4">
          <button
            className="h-10 px-4 text-red-500 border border-red-500 rounded-lg"
            onClick={() => window.open(`https://www.google.com/maps?q=${donationDetails?.location?.latitude},${donationDetails?.location?.longitude}`, '_blank')}
          >
            View Hospital Location on Google Maps
          </button>
        </div>
      </div>
  
      <div className="mt-8 hidden md:block">
        <img className="h-32" src={userlogo} alt="User Logo" />
      </div>
    </div>
  
    {/* Donation Form */}
    <div className='text-lg md:text-xl mb-4 text-center'>
      <p>Fill Out The Form To Donate The Blood.</p>
      <p>Your details will be shared with the Requestor so that they can contact you.</p>
    </div>
  
    <div className="w-full max-w-md p-4 bg-gray-300 flex flex-col items-center">
      <h2 className="text-lg md:text-xl font-bold mb-4">Submit Your Details</h2>
  
      <div className="w-full overflow-x-auto">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold">Name:</label>
            <input
              type="text"
              id="name"
              className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
  
          <div className="flex flex-col">
            <label htmlFor="phoneNumber" className="mb-2 font-semibold">Phone Number:</label>
            <input
              type="number"
              id="phoneNumber"
              className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
  
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="gender" className="mb-2 font-semibold">Gender:</label>
            <select
              id="gender"
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
  
          <div className="flex flex-col">
            <label htmlFor="weight" className="mb-2 font-semibold">Weight:</label>
            <input
              type="number"
              id="weight"
              className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
  
          <div className="flex flex-col">
            <label htmlFor="age" className="mb-2 font-semibold">Age:</label>
            <input
              type="number"
              id="age"
              className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
  
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="bloodGroup" className="mb-2 font-semibold">Blood Group:</label>
            <select
              id="bloodGroup"
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              <option value="">Select Blood Group</option>
              {filteredBloodGroups.map((group, index) => (
                <option key={index} value={group}>
                  {group.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
  
      <button
        type="button"
        onClick={handleResponseSubmit}
        className="mt-6 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 text-lg transition"
      >
        Submit
      </button>
    </div>
  </div>
  
  );
};

export default HospitalDonationDetails;
